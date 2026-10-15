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

5. Refresh the index in the top `README.md`. For a new repo, first add an entry with its area
   and a one-line description to [`estate.json`](../estate.json). Then run:

   ```
   node .github/scripts/build-index.mjs
   ```

   The `Estate index` check fails a pull request if the index is stale, or if a `repos/`
   directory has no `estate.json` entry.

6. Commit on a branch, push it, and open a pull request. `main` accepts changes only through
   a pull request, and the `gitleaks`, `betterleaks`, and `private-names` checks must pass.
   The merge redeploys the viewers.

## Notes

- The exact command sequence and output layout are frozen by the pilot ticket
  (`treetracker-api`). Follow that layout for every repo so the estate stays uniform.
- `treetracker` is a large monorepo. Expect a longer run.
- `treetracker-android` is Kotlin and `treetracker-infrastructure` is HCL. Confirm the
  suite handles both, or record any gap in that repo's `README.md`.
- The `pre-push` hook and the CI checks block secrets and names of private Greenstand repos.
  A new graph can mirror such a name from its source. Set up the hook before you push, and
  read [`private-names.md`](./private-names.md) for what to do when a check stops you.
