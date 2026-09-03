# treetracker-wallet-app

Machine-generated documentation for [`Greenstand/treetracker-wallet-app`](https://github.com/Greenstand/treetracker-wallet-app),
the Greenstand Treetracker Wallet App: a Yarn v4 monorepo containing a Next.js web
wallet, an Expo React Native mobile wallet, a NestJS backend service, a Cucumber/
WebdriverIO BDD test suite, and shared TypeScript packages (Keycloak auth, wallet API
client, Jotai state, Postgres pub/sub queue) for secure digital token transfers tied to
tree-planting and forest-management activity.

## Snapshot

- **Source commit:** [`51ae4e3`](https://github.com/Greenstand/treetracker-wallet-app/commit/51ae4e337957e06e372cd73346ead9c9e6c471eb)
- **Snapshot date:** 2026-09-03
- **Files analyzed:** 415
- **Graph:** 702 nodes, 1093 edges, 8 architecture layers, 14-step guided tour
- **Domain graph:** 4 domains, 14 flows, 64 steps
- **Primary language:** TypeScript/TSX

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |

## Business domains

- **Wallet Management** — wallet creation, viewing/updating wallets and balances, event-driven auto-provisioning on account creation.
- **Token Transfer** — send/accept/decline/cancel transfers, share-via-link (action tokens), transfer and token history.
- **Search & Discovery** — searching wallets and displaying a wallet's QR code for identification.
- **Authentication & Identity** — Keycloak-delegated registration, login, session token management, and backend service-to-service auth.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This
repo ships the graph data, not a live dashboard. To explore interactively, load a graph
file with the `/understand-anything:understand-dashboard` skill locally, or view it at
the published viewer:

https://arnoldcastro5000.github.io/understand-greenstand/treetracker-wallet-app/

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the
source repo, run `/understand` then `/understand-domain` then `/understand-onboard`, and
replace this directory.
