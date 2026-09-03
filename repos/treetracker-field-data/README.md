# treetracker-field-data

Machine-generated documentation for [`Greenstand/treetracker-field-data`](https://github.com/Greenstand/treetracker-field-data),
the Greenstand Field Data service: a Node.js/Express microservice that owns the raw tree-tracking
data uploaded from treetracker app devices. It follows an MVC-like layered architecture
(Protocol/Service/Model/Repository) over two PostgreSQL databases (app field-data + legacy
treetracker main) using Knex, with Joi/express-validator validation, Swagger docs, and RabbitMQ
(rascal/amqplib) messaging.

## Snapshot

- **Source commit:** [`a6dfe14`](https://github.com/Greenstand/treetracker-field-data/commit/a6dfe14903d2ab2ca2cc60bea2fe18411ca02449)
- **Snapshot date:** 2026-09-03
- **Primary language:** JavaScript
- **Files analyzed:** 217
- **Graph:** 280 nodes, 365 edges, 10 architecture layers, 12-step guided tour
- **Domain graph:** 6 domains, 15 flows, 60 steps

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |
| [`meta.json`](./meta.json) | Snapshot metadata (analyzed-at, source commit, file count) probed by the viewer for its staleness banner. |

## Business domains

- **Raw Capture Ingestion** — capture creation, rejection, and query with dual-database writes.
- **Session & Track Tracking** — capture sessions, session segments, and device tracks.
- **Device Configuration** — device registration and queries.
- **Wallet Registration** — idempotent wallet registration and queries.
- **Domain Events & Messaging** — event-sourcing outbox plus RabbitMQ publish/consume/replay.
- **Legacy Database Bridging** — legacy tree dual-write and ETL backfill during the migration.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, load a graph file with the
`/understand-anything:understand-dashboard` skill locally, or open the hosted viewer:

<https://arnoldcastro5000.github.io/understand-greenstand/treetracker-field-data/>

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
