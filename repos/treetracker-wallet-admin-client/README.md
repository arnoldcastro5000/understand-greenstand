# treetracker-wallet-admin-client

Machine-generated documentation for [`Greenstand/treetracker-wallet-admin-client`](https://github.com/Greenstand/treetracker-wallet-admin-client),
the Greenstand wallet admin panel: a React (Create React App) single-page app over the Greenstand
wallet API, built with Material UI (MUI), axios, react-router, and react-quill.

## Snapshot

- **Source commit:** [`62a60f3`](https://github.com/Greenstand/treetracker-wallet-admin-client/commit/62a60f30956b2c364ca0483509569e5fdcb7ed4b)
- **Snapshot date:** 2026-09-03
- **Primary language:** JavaScript
- **Files analyzed:** 131
- **Graph:** 232 nodes, 450 edges, 8 architecture layers, 12-step guided tour
- **Domain graph:** 5 domains, 10 flows, 43 steps

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |
| [`meta.json`](./meta.json) | Snapshot metadata (analyzed-at, source commit, file count) for the viewer staleness banner. |

## Business domains

- **Authentication & Access** — login form, credential validation, JWT persistence, and route gating.
- **Wallet Management** — wallet list, wallet detail view (token and pending-transfer stats), and managed sub-wallet creation.
- **Token Transfers** — sending tokens to trusted and untrusted wallets, and managing the resulting transfer records.
- **Trust Relationships** — requesting, accepting, declining, and deleting trust links between wallets.
- **Wallet Customization** — editing a wallet's public profile (display name, about text, logo and hero image).

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. Explore this snapshot in the static viewer:
<https://arnoldcastro5000.github.io/understand-greenstand/treetracker-wallet-admin-client/>

To explore interactively offline, load a graph file with the
`/understand-anything:understand-dashboard` skill locally.

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
