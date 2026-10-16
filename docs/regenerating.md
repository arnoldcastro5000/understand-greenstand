# Regenerating a repo's documentation

This documentation is regenerate-ready. Each source repo's directory under `repos/` is
produced by the same recipe. To regenerate one repo, re-run the recipe and replace that
repo's directory.

## When to regenerate

Regenerate a repo on a trigger, not on a calendar. An old snapshot does not break anything: the
viewer loads source at the snapshot commit, so the docs match the code that they describe. They
only fall behind the current code.

Regenerate a repo when one of these happens:

1. A structural change in the source repo: modules added, removed, or renamed; a new service;
   an API or domain change. Dependency bumps, typo fixes, and CI-only changes do not count.
2. A recipe or tool change: a new Understand-Anything version with better output, or a fix to
   the recipe below. Regenerate every repo that the change affects.
3. A freshness pass before a handover, for example the transfer of this repo to the Greenstand
   org.
4. A reader reports a wrong doc.

### The drift report

The `Drift report` workflow ([`drift-report.yml`](../.github/workflows/drift-report.yml)) signals
trigger 1. Every Monday it compares the snapshot of each repo (`repos/<repo-name>/meta.json`)
with the default branch of the source repo. It counts:

- the described files that changed. A described file is a file with a node in the repo's
  `knowledge-graph.json`.
- the described files that were removed or renamed.
- the new files, all changed files, and the commits, as context.

A repo is **due** when any described file was removed or renamed, or when at least 5% of its
described files changed. New files do not count, because they are often tests. A repo is also
due when its snapshot commit is gone or is not on the default branch.

The report goes to the job summary and to one issue, "Docs drift report". The workflow opens
the issue when a repo is due, edits it on each run, comments when the list of due repos
changes, and closes it when no repo is due. Do not close the issue by hand: the next run opens
it again while a repo is due. A repo stays due until you regenerate it.

The report shows only repo names, counts, and compare links. Before the job prints or posts any
text, it runs the private-name check on it (see [`private-names.md`](./private-names.md)). The
job needs the `PRIVATE_REPO_NAMES` secret, and fails without it.

To see the report now, run it locally. It prints the report and changes nothing:

```
GITHUB_TOKEN="$(gh auth token)" node .github/scripts/drift-report.mjs
```

A run makes about 2 GitHub API requests per repo. Without a token, the limit is 60 requests an
hour.

Limits:

- GitHub can delay or skip a scheduled run. In a public repo, GitHub turns off a schedule after
  60 days without activity. Turn it on again on the repo's Actions tab.
- The compare API lists at most 300 changed files. A repo with 300 or more changed files is
  due.
- A source repo that the report cannot find (deleted, or private now) fails the job. The
  public output does not show its name; a local run does. See
  [`private-names.md`](./private-names.md#a-repo-turns-private-after-we-wrote-its-name).

## Prerequisites

- The [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) plugin installed and active in Claude
  Code (`understand`, `understand-domain`, `understand-onboard` skills).
- `gh` logged in with push access to this repo.

## Per-repo recipe

1. Clone the source repo into a scratch area outside this tree:

   ```
   git clone https://github.com/Greenstand/<repo-name> /tmp/<repo-name>
   ```

2. Run the understand suite against the clone, in order:

   - `/understand-anything:understand`: builds the `knowledge-graph.json`.
   - `/understand-anything:understand-domain`: extracts the business domain flow.
   - `/understand-anything:understand-onboard`: renders the onboarding guide.

3. Land the outputs under `repos/<repo-name>/`:

   - `knowledge-graph.json`
   - the domain markdown and domain graph
   - the onboarding guide
   - a short per-repo `README.md`: a one-paragraph description of the source repo, then the
     sections `## Snapshot`, `## Contents`, `## Business domains`, and `## Regenerating`. Use
     no em dash. Do not write how to view the graphs: step 7 adds a "Start here" section with
     the viewer link.
   - `meta.json` (`gitCommitHash`, `lastAnalyzedAt`): the viewer loads source at that
     commit, and the top `README.md` index shows both values

4. Record the source commit SHA and the snapshot date in that repo's `README.md`.

5. Refresh the glossaries. Run:

   ```
   node .github/scripts/build-glossary.mjs
   ```

   The script writes `repos/<repo-name>/GLOSSARY.md` and the estate glossary `GLOSSARY.md`
   from the domain graphs alone, so it needs no other input. The `Estate index` check fails a
   pull request if a glossary is missing or stale.

6. Refresh the index in the top `README.md`. For a new repo, first add an entry with its area
   and a one-line description to [`estate.json`](../estate.json). Then run:

   ```
   node .github/scripts/build-index.mjs
   ```

   The `Estate index` check fails a pull request if the index is stale, if a `repos/`
   directory has no `estate.json` entry, or if a repo directory lacks its graph, `README.md`,
   or `ONBOARDING.md`. The deploy builds the landing page of the live site from the same
   `estate.json` (`.github/scripts/build-landing.mjs`), so the landing page needs no edit.

7. Refresh the "Start here" section of each per-repo `README.md`. Run:

   ```
   node .github/scripts/build-repo-readmes.mjs
   ```

   The script puts the section before the first `##` heading of the README. The section links
   the viewer, the onboarding guide, the glossary, and the source repo. It also links the
   `CONTRIBUTING.md` of the source repo (if it is a described file), the good first issues, and
   the volunteer guide. The `Estate index` check fails a pull request if a section is missing,
   stale, or not first. It also fails if a per-repo README has an em dash, or tells how to view
   the graphs outside the section.

8. Commit on a branch, push it, and open a pull request. `main` accepts changes only through
   a pull request, and the `gitleaks`, `betterleaks`, `private-names`, and `estate-index`
   checks must pass.
   The merge redeploys the viewers and the landing page.

## When a source repo is renamed

GitHub sends the former name of a renamed repo to the new name, until someone creates a repo
with the former name. Thus the docs continue to work for some time. Follow the new name when
you regenerate the repo, so that the new docs use the new name everywhere:

1. Move the directory:

   ```
   git mv repos/<former-name> repos/<new-name>
   ```

2. In [`estate.json`](../estate.json), set the `name` of the entry to the new name. Add the
   former name to the `formerNames` list of the entry:

   ```json
   { "name": "<new-name>", "formerNames": ["<former-name>"], "description": "..." }
   ```

3. Find the other lines that contain the former name. Run:

   ```
   node .github/scripts/check-former-names.mjs
   ```

   The script shows each line of a hand-written file that contains the former name. Examples
   are the edges, their evidence, and `checkedAt` in [`ecosystem.json`](../ecosystem.json),
   the text of [`ARCHITECTURE.md`](../ARCHITECTURE.md) and of the top `README.md`, and the
   per-repo `README.md`. Replace the former name with the new name on each line. Then run
   `node .github/scripts/build-ecosystem-maps.mjs`.

4. Commit steps 1 to 3 before the regeneration. Then git can follow the history of each file
   to its new path: a regeneration changes the files too much for git to find the move.

5. Regenerate the repo with the [per-repo recipe](#per-repo-recipe). Clone the repo by its new
   name, so that the graphs, the onboarding guide, and the glossaries use the new name.

The `Estate index` check fails if `repos/<former-name>/` remains, if a former name is the name
of a repo, or if a line of a hand-written file contains a former name. The README index and the
landing page show the former name after the description.

Pages has no redirects. Thus the deploy writes a moved page for each page of the repo on the
site: `<former-name>/`, `<former-name>/onboarding.html`, and the other pages
(`.github/scripts/build-moved.mjs`). A moved page sends the reader to the same page under the
new name, with its `#anchor`. Links to other files of the site (the graphs, the raw Markdown)
under the former name stop working. Links to `repos/<former-name>/` on GitHub also stop
working.

## Notes

- The exact command sequence and output layout are frozen by the pilot ticket
  (`treetracker-api`). Follow that layout for every repo so the estate stays uniform.
- `treetracker-android` is Kotlin and `treetracker-infrastructure` is HCL. Confirm the
  suite handles both, or record any gap in that repo's `README.md`.
- The `pre-push` hook and the CI checks block secrets and names of private Greenstand repos.
  A new graph can mirror such a name from its source. Set up the hook before you push, and
  read [`private-names.md`](./private-names.md) for what to do when a check stops you.
- After you regenerate a repo, the `Estate index` check fails until you check the edges of that
  repo in [`ecosystem.json`](../ecosystem.json) again. Each edge records its evidence at the old
  snapshot. Fix the edges, set the `checkedAt` entry of the repo to the new snapshot commit, and
  run `node .github/scripts/build-ecosystem-maps.mjs`. See [`ARCHITECTURE.md`](../ARCHITECTURE.md).
