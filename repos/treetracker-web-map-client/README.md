# treetracker-web-map-client

Machine-generated documentation for [`Greenstand/treetracker-web-map-client`](https://github.com/Greenstand/treetracker-web-map-client),
the Greenstand Treetracker Web Map: a Next.js/React single-page application rendering an interactive
Leaflet map of tracked trees, planters, organizations, and blockchain wallet/token data, backed by
Material UI 5 and Keycloak/OIDC authentication.

## Snapshot

- **Source commit:** [`0f4d5b0`](https://github.com/Greenstand/treetracker-web-map-client/commit/0f4d5b00539575498821b84657f4f3f61c5bac6d)
- **Snapshot date:** 2026-09-03
- **Files analyzed:** 379
- **Graph:** 614 nodes, 888 edges, 8 architecture layers, 14-step guided tour
- **Domain graph:** 6 domains, 16 flows, 77 steps
- **Primary language:** JavaScript (Next.js / React)

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |

## Business domains

- **Map Exploration & Search** — interactive Leaflet map, timeline date filtering, entity search.
- **Entity Profile Pages** — tree, capture, planter, and organization detail pages.
- **Blockchain Wallet & Token Tracking** — wallet profiles, token ownership and transaction provenance.
- **Impact & Leaderboard** — homepage impact highlights and the country/planter/tree leaderboard.
- **Site Administration & Customization** — admin branding, navbar, map location, and MUI theme config.
- **Authentication & Sharing** — OIDC/Keycloak sign-in/out, and share-link/embed dialogs for entity pages.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, load a graph file with
the `/understand-anything:understand-dashboard` skill locally, or use the hosted viewer:

https://arnoldcastro5000.github.io/understand-greenstand/treetracker-web-map-client/

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
