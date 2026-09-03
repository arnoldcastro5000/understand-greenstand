# treetracker-wallet-api

Machine-generated documentation for [`Greenstand/treetracker-wallet-api`](https://github.com/Greenstand/treetracker-wallet-api),
the Greenstand TreeTracker Wallet API: a Node.js/Express microservice over PostgreSQL (Knex),
managing wallets, trust relationships between wallets, and token/bundle transfers, with JWT
(RS256) and API-key authentication.

## Snapshot

- **Source commit:** [`e95c15a`](https://github.com/Greenstand/treetracker-wallet-api/commit/e95c15a933e969eea4b4bdaab73e96bac95f5f8f)
- **Snapshot date:** 2026-09-03
- **Files analyzed:** 268
- **Graph:** 401 nodes, 752 edges, 10 architecture layers, 13-step guided tour
- **Domain graph:** 6 domains, 20 flows, 53 steps
- **Primary language:** JavaScript

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |

## Business domains

- **Authentication** — sign-in and request auth middleware (JWT/API-key).
- **Wallet Management** — wallet CRUD, hierarchical control-over, batch create/transfer via CSV.
- **Trust Relationship Management** — request/accept/decline/cancel trust between wallets, management-circle checks.
- **Token Transfer** — initiate/accept/decline/cancel/fulfill transfer state machine for tokens and bundles.
- **Token Query** — read-only token/transaction lookups with ownership checks.
- **Event/Audit Logging** — internal event logging plus wallet event history queries.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, load a graph file with
the `/understand-anything:understand-dashboard` skill locally, or view it at
[the hosted viewer](https://arnoldcastro5000.github.io/understand-greenstand/treetracker-wallet-api/).

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
