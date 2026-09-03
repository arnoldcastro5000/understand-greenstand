# treetracker-admin-client

Machine-generated documentation for [`Greenstand/treetracker-admin-client`](https://github.com/Greenstand/treetracker-admin-client),
the Greenstand Treetracker Admin Panel client: a React web frontend (create-react-app, Material UI,
Redux/@rematch/core) for verifying, processing, and managing tree-planting data collected by the
Treetracker app, mid-migration from a legacy dedicated API to Greenstand microservices.

## Snapshot

- **Source commit:** [`ecbfe05`](https://github.com/Greenstand/treetracker-admin-client/commit/ecbfe050405695a5ca31ab630614ee3e122cddc4)
- **Snapshot date:** 2026-09-03
- **Files analyzed:** 241
- **Graph:** 453 nodes, 1031 edges, 8 architecture layers, 10-step guided tour
- **Domain graph:** 8 domains, 17 flows, 87 steps

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |

## Business domains

- **Authentication & Access Control** — admin login, session storage, permission-gated navigation.
- **Capture Management** — verifying, browsing, exporting, and de-duplicating tree-planting captures.
- **Grower Management** — browsing, filtering, and managing the grower (tree planter) directory.
- **Reference Data Management** — species taxonomy and regions/geographic reference catalogs.
- **Stakeholder & Organization Management** — stakeholder organizations that growers and users belong to.
- **Messaging & Surveys** — direct and broadcast messaging with growers, including announcements and surveys.
- **Earnings & Payments Reporting** — grower earnings from verified captures and payment confirmations.
- **Reporting & Analytics Dashboard** — admin home page with stat cards and date-range-filterable reporting.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, load a graph file with
the `/understand-anything:understand-dashboard` skill locally.

Viewer: https://arnoldcastro5000.github.io/understand-greenstand/treetracker-admin-client/

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
