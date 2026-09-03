# treetracker-query-api

Machine-generated documentation for [`Greenstand/treetracker-query-api`](https://github.com/Greenstand/treetracker-query-api),
the Greenstand TreeTracker Query API: a RESTful read API over the treetracker PostgreSQL data
(captures, planters/growers, organizations, trees and more). Built on Node.js/Express with a
Domain Driven Design layered architecture (Express routers, business models, knex/pg
repositories), Joi validation, an OpenAPI spec, and rascal/RabbitMQ messaging.

## Snapshot

- **Source commit:** [`42897d6`](https://github.com/Greenstand/treetracker-query-api/commit/42897d62c4a9e5fa4a49e99720ed28f3a254bb97)
- **Snapshot date:** 2026-09-03
- **Primary language:** TypeScript
- **Files analyzed:** 189
- **Graph:** 242 nodes, 344 edges, 8 architecture layers, 13-step guided tour
- **Domain graph:** 5 domains, 13 flows, 56 steps

## View it

Explore the interactive graphs in the Understand-Anything viewer:
**https://arnoldcastro5000.github.io/understand-greenstand/treetracker-query-api/**

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |
| [`meta.json`](./meta.json) | Snapshot metadata (analyzed-at, source commit, file count) used by the viewer's staleness banner. |

## Business domains

- **Tree & Capture Data** — queries over trees, processed captures, and raw (unprocessed) captures.
- **Stakeholder Directory** — planters, grower accounts (v2), organizations, and stakeholders.
- **Species Catalog** — filtered species lists and single-species lookups.
- **Geospatial & Mapping** — map bounding boxes from capture coordinates, PostGIS nearest-feature, countries and planting leaderboard.
- **Token & Transaction Ledger** — issued tokens (linked to captures and wallets), token transactions between wallets, and contracts.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, open the viewer URL above
or load a graph file with the `/understand-anything:understand-dashboard` skill locally.

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
