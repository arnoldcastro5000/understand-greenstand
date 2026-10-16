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
writes which file. A regeneration replaces a hand edit of a generated file. To change a
generated file, change its input or the recipe.

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
   node .github/scripts/build-glossary.mjs --check
   node .github/scripts/build-repo-readmes.mjs --check
   node .github/scripts/check-former-names.mjs
   ```

6. Open a pull request. `main` accepts changes only through a pull request. The required checks
   must pass.
