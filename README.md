# understand-greenstand

Machine-generated documentation for the core-active Greenstand repository estate.

## Explore the viewers

**[Open the live site → https://arnoldcastro5000.github.io/understand-greenstand/](https://arnoldcastro5000.github.io/understand-greenstand/)**

The landing page indexes every documented repo. Each one has an interactive knowledge-graph
viewer (structural + domain views, a guided tour, and inline source loaded from GitHub) plus a
rendered onboarding guide and README.

Each source repo also has one directory under [`repos/`](./repos/). A directory holds that
repo's `knowledge-graph.json` plus rendered domain and onboarding markdown, produced by
the [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) skill suite
(`understand`, `understand-domain`, `understand-onboard`).

The layout is regenerate-ready. See [`docs/regenerating.md`](./docs/regenerating.md) for
how to refresh a repo's docs.

## Repository index

The [live landing page](https://arnoldcastro5000.github.io/understand-greenstand/) lists all
documented repos with Viewer, Onboarding, and README links. The per-repo source directories are
under [`repos/`](./repos/).

## Scope

The estate covers 14 documented repositories: the core Tree Tracker services, the wallet stack,
the admin tools, the web map, the mobile app, the data-ingest services, and the infrastructure
repo, plus the `node-mapnik-1` fork (included by request). Other fork repos, private repos, and
dormant repos are out of scope.
