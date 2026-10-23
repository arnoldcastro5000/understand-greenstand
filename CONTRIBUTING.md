# Contributing to these docs

This repo holds generated documentation for Greenstand's source repos. This page tells you how
to report a problem in these docs and how to change them. To contribute to Greenstand's code,
read [How to contribute to Greenstand](./docs/contribute-to-greenstand.md).

Everyone who takes part here follows the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Report a problem

- A page, a graph, or a glossary here is wrong: open a
  [Wrong docs](../../issues/new?template=wrong-docs.yml) issue.
- You have an idea to make these docs more useful: open a
  [Docs improvement](../../issues/new?template=docs-improvement.yml) issue.
- You found a bug in Greenstand's code: report it in its source repo, not here.

## Know what is generated

Most files here are generated. The recipe in
[Regenerating a repo's documentation](./docs/regenerating.md#per-repo-recipe) tells which step
writes which file. A regeneration replaces a direct edit of a generated file. To change a
generated file, change its input or the recipe. Text that is not generated is edited text.
Change it directly in its file.

## Change the docs

1. Follow [Set up your clone](./docs/private-names.md#set-up-your-clone) in
   `docs/private-names.md`.
2. Fork this repo, or ask a maintainer for access.
3. Work on a branch.
4. To regenerate a repo, follow [the recipe](./docs/regenerating.md#per-repo-recipe).
   [When to regenerate](./docs/regenerating.md#when-to-regenerate) tells you when a repo is due.
5. Check the generated files:

   ```
   node .github/scripts/build-index.mjs --check
   node .github/scripts/build-ecosystem-maps.mjs --check
   node .github/scripts/build-shared-resources.mjs --check
   node .github/scripts/build-glossary.mjs --check
   node .github/scripts/build-repo-readmes.mjs --check
   node .github/scripts/build-onboarding.mjs --check
   node .github/scripts/check-former-names.mjs
   node .github/scripts/check-graphs.mjs
   ```

   If you change `shared-resources.json`, also run
   `node .github/scripts/build-shared-resources.mjs --evidence`. It reads each cited file on
   GitHub and checks that each name is in its cited lines. The pull request runs it too.

6. Open a pull request. `main` accepts changes only through a pull request. The required checks
   must pass.

## Change the shared-resource page

The page `docs/shared-resources.md` must hold no security detail. A security detail is a fact
that helps an attacker or shows a weak point of a shared resource or a code repo. Thus a pull
request that changes `docs/shared-resources.md` or `shared-resources.json` needs a safety review.
A reviewer who did not write the change checks the changed text against the local findings list,
before the pull request opens. This list is private. If you do not have the list, ask a
maintainer to do the review. When the text has no security detail, the reviewer gives you this
line, and you add it to the pull request text:

`Safety review: the page text was checked against the local findings list on <YYYY-MM-DD>. It
has no security detail.`

Keep the item about the page unticked in the pull request text. The maintainer who merges ticks
it. The required `private-names` check fails until the pull request text has the line and the
ticked item.
