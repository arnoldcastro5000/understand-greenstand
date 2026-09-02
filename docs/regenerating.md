# Regenerating a repo's documentation

This documentation is regenerate-ready. Each source repo's directory under `repos/` is
produced by the same recipe. To refresh one repo, re-run the recipe and replace that
repo's directory.

## Prerequisites

- The [Understand-Anything](https://github.com/) plugin installed and active in Claude
  Code (`understand`, `understand-domain`, `understand-onboard` skills).
- `gh` logged in with push access to this repo.

## Per-repo recipe

1. Clone the source repo into a scratch area outside this tree:

   ```
   git clone https://github.com/Greenstand/<repo-name> /tmp/<repo-name>
   ```

2. Run the understand suite against the clone, in order:

   - `/understand-anything:understand` — builds the `knowledge-graph.json`.
   - `/understand-anything:understand-domain` — extracts the business domain flow.
   - `/understand-anything:understand-onboard` — renders the onboarding guide.

3. Land the outputs under `repos/<repo-name>/`:

   - `knowledge-graph.json`
   - the domain markdown and domain graph
   - the onboarding guide
   - a short per-repo `README.md`

4. Record the source commit SHA and the snapshot date in that repo's `README.md`.

5. Commit and push.

## Notes

- The exact command sequence and output layout are frozen by the pilot ticket
  (`treetracker-api`). Follow that layout for every repo so the estate stays uniform.
- `treetracker` is a large monorepo. Expect a longer run.
- `treetracker-android` is Kotlin and `treetracker-infrastructure` is HCL. Confirm the
  suite handles both, or record any gap in that repo's `README.md`.
