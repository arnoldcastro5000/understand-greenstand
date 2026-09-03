# images-api

Machine-generated documentation for [`Greenstand/images-api`](https://github.com/Greenstand/images-api),
the Greenstand Images API: a Node.js/Express microservice that exposes a RESTful image resize API
(remote fetch, Joi validation, Sharp transforms) over a layered MVC structure, with a Knex/PostgreSQL
persistence scaffold and Kustomize/GitHub Actions deployment.

## Snapshot

- **Source repo:** [`Greenstand/images-api`](https://github.com/Greenstand/images-api)
- **Source commit:** [`9d761d1`](https://github.com/Greenstand/images-api/commit/9d761d1697fd84c6a58c1da3fae2f8834c63ddc5)
- **Snapshot date:** 2026-09-03
- **Primary language:** JavaScript
- **Files analyzed:** 53
- **Graph:** 66 nodes, 59 edges, 8 architecture layers, 13-step guided tour
- **Domain graph:** 4 domains, 8 flows, 34 steps, 45 edges

## Viewer

The live viewer will be at https://arnoldcastro5000.github.io/understand-greenstand/images-api/

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |
| [`meta.json`](./meta.json) | Analyzed-at timestamp, source commit, and file count. The static viewer probes it for the staleness banner. |

## Business domains

- **Image Processing & Delivery** — remote image fetch, Joi parameter validation, Sharp resize, and streamed delivery.
- **API Request Lifecycle** — application bootstrap, Express app factory, middleware chain, and routing.
- **Data Persistence** — Knex/Postgres scaffold: base repository, session, and connection modules.
- **Build & Deployment** — pull-request CI, build/deploy to dev, and promotion to production.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, load a graph file with
the `/understand-anything:understand-dashboard` skill locally.

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
