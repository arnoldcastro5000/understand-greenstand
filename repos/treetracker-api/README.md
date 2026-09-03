# treetracker-api

Machine-generated documentation for [`Greenstand/treetracker-api`](https://github.com/Greenstand/treetracker-api),
the Greenstand TreeTracker API: a Node.js/Express microservice over PostgreSQL (Knex), with
Joi/express-validator validation, Swagger docs, and RabbitMQ (rascal/amqplib) messaging.

## Snapshot

- **Source commit:** [`85258c8`](https://github.com/Greenstand/treetracker-api/commit/85258c8ee5f1cae66a3de3e7d8b3b37faf1ae35c)
- **Snapshot date:** 2026-09-02
- **Files analyzed:** 307
- **Graph:** 382 nodes, 434 edges, 9 architecture layers, 12-step guided tour
- **Domain graph:** 5 domains, 12 flows, 46 steps

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |

## Business domains

- **Capture Management** — capture ingestion and query.
- **Tree Management** — tree registration, capture-to-tree matching (PostGIS spatial), legacy tree approval.
- **Grower Account Management** — grower account upsert, grower account image upload (S3).
- **Tagging** — tag management, capture-tag assignment, tree-tag assignment.
- **Domain Events & Messaging** — event publication and consumption over RabbitMQ.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, load a graph file with
the `/understand-anything:understand-dashboard` skill locally.

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
