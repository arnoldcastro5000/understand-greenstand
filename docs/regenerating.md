# Regenerating a repo's documentation

This documentation is regenerate-ready. Each source repo's directory under `repos/` is
produced by the same recipe. To refresh one repo, re-run the recipe and replace that
repo's directory.

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
   - a short per-repo `README.md`
   - `meta.json` (`gitCommitHash`, `lastAnalyzedAt`): the viewer loads source at that
     commit, and the top `README.md` index shows both values

4. Record the source commit SHA and the snapshot date in that repo's `README.md`.

5. Refresh the "Run it locally" section of `ONBOARDING.md`. `/understand-onboard` does not
   write it: [`run-locally.json`](#the-run-locallyjson-file) in the repo directory holds it.
   Check each step against the source repo at the new commit (best: run the steps), update the
   file, and set `sourceCommit` to the new `gitCommitHash`. Then run:

   ```
   node .github/scripts/build-onboarding.mjs
   ```

   The script writes the section after the first section of `ONBOARDING.md` (the project
   overview). The `Estate index` check fails a pull request if a section is missing or stale,
   or if `sourceCommit` does not match `meta.json`.

6. Refresh the index in the top `README.md`. For a new repo, first add an entry with its area
   and a one-line description to [`estate.json`](../estate.json). Then run:

   ```
   node .github/scripts/build-index.mjs
   ```

   The `Estate index` check fails a pull request if the index is stale, if a `repos/`
   directory has no `estate.json` entry, or if a repo directory lacks its graph, `README.md`,
   or `ONBOARDING.md`. The deploy builds the landing page of the live site from the same
   `estate.json` (`.github/scripts/build-landing.mjs`), so the landing page needs no edit.

7. Commit on a branch, push it, and open a pull request. `main` accepts changes only through
   a pull request, and the `gitleaks`, `betterleaks`, `private-names`, and `estate-index`
   checks must pass.
   The merge redeploys the viewers and the landing page.

## The run-locally.json file

Each repo directory has a `run-locally.json`. It is the source of the "Run it locally" section
of `ONBOARDING.md`. The section is generated: do not edit it by hand.

- `sourceCommit`: the full SHA that the steps were checked against. It must equal
  `gitCommitHash` in `meta.json`.
- `sources`: the paths in the source repo that the steps come from. The section links each
  path at `sourceCommit`.
- `intro` (optional): Markdown text before the prerequisites.
- `prerequisites`: Markdown list items: the tools and their versions.
- `steps`: each step has a `title`, and `text` (Markdown), `code` (a list of lines), or both.
  `lang` sets the language of the code block (default `bash`). The script adds step 1, "Get
  the code", itself.

Rules for the content:

- Write the commands that a volunteer types on their own machine. Run services (PostgreSQL,
  RabbitMQ) in Docker.
- Prefer the commands of the source repo's CI workflow: CI shows that they work. The source
  README can be older than the code.
- Write only facts that the sources or a test run show. Record a failure that you see at the
  snapshot as "At this commit, ...", with the error text.

## Notes

- The exact command sequence and output layout are frozen by the pilot ticket
  (`treetracker-api`). Follow that layout for every repo so the estate stays uniform.
- `treetracker` is a large monorepo. Expect a longer run.
- `treetracker-android` is Kotlin and `treetracker-infrastructure` is HCL. Confirm the
  suite handles both, or record any gap in that repo's `README.md`.
- The `pre-push` hook and the CI checks block secrets and names of private Greenstand repos.
  A new graph can mirror such a name from its source. Set up the hook before you push, and
  read [`private-names.md`](./private-names.md) for what to do when a check stops you.
