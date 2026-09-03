# treetracker-admin-api

Machine-generated documentation for [`Greenstand/treetracker-admin-api`](https://github.com/Greenstand/treetracker-admin-api),
the Greenstand Treetracker Admin Panel API: a TypeScript LoopBack 4 REST service (over Express) on
PostgreSQL (loopback-connector-postgresql), with JWT auth and policy-based authorization, an OpenAPI
spec, and RabbitMQ (rascal/amqplib) domain-event messaging.

## Snapshot

- **Source commit:** [`1f25d3e`](https://github.com/Greenstand/treetracker-admin-api/commit/1f25d3e63c2a0d13190427c21a61f7cd99e9b898)
- **Snapshot date:** 2026-09-03
- **Primary language:** TypeScript
- **Files analyzed:** 130
- **Graph:** 184 nodes, 230 edges, 9 architecture layers, 14-step guided tour
- **Domain graph:** 5 domains, 14 flows, 58 steps

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |
| [`meta.json`](./meta.json) | Analyzed-at timestamp, source commit, and file count. Used by the viewer's staleness banner. |

## Business domains

- **Capture Verification** — capture browse/search and the verify-approve-reject flow, with a
  transactional domain-event + RabbitMQ outbox, plus tree-tag management.
- **Grower Management** — grower browse and update, and planter-registration queries.
- **Organization Management** — organization browse and organization-scope resolution reused across
  other domains.
- **Identity & Access Control** — admin login (JWT), request authorization (`isAuth` policy), audit
  logging, and admin-user management.
- **Species & Tag Catalog** — species management (CRUD, capture-count, combine) and tag management.

## Viewing the graphs

Explore the graphs interactively in the Understand-Anything viewer:
<https://arnoldcastro5000.github.io/understand-greenstand/treetracker-admin-api/>

The JSON graphs also render in the local Understand-Anything dashboard (one graph at a time). This
repo ships the graph data, not a live dashboard. To explore locally, load a graph file with the
`/understand-anything:understand-dashboard` skill.

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
