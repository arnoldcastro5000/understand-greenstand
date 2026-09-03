# treetracker-android

Machine-generated documentation for [`Greenstand/treetracker-android`](https://github.com/Greenstand/treetracker-android),
Greenstand's native Android app for the Treetracker reforestation platform: growers register
tree captures (photos and GPS) offline, manage grower accounts and wallets, and sync captures to
the Treetracker backend. Built with Kotlin, Jetpack Compose, Koin, Room, Retrofit, Coroutines,
WorkManager, the AWS S3 SDK, and MapLibre.

## Snapshot

- **Source commit:** [`949d962`](https://github.com/Greenstand/treetracker-android/commit/949d9624a8782ea2805d67e1ff7dfae7ef97e4cd)
- **Snapshot date:** 2026-09-03
- **Primary language:** Kotlin
- **Files analyzed:** 445
- **Graph:** 910 nodes, 1680 edges, 8 architecture layers, 12-step guided tour
- **Domain graph:** 6 domains, 18 flows, 65 steps

> Kotlin parsed to 220 classes + 246 functions (the rest of the 910 nodes are 317 files, 69 config, 45 document, and 14 pipeline nodes).

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |
| [`meta.json`](./meta.json) | Analyzed-at timestamp, source commit, and file count (viewer staleness banner). |

## Business domains

- **Tree Capture** — capture a tree as a geotagged photo: camera, GPS convergence, image review with an optional note, and local persistence.
- **Grower Onboarding & Identity** — grower (planter) sign-up, active-grower selection, and profile management; registers the grower with the platform.
- **Organization & Wallet Selection** — the organization a grower belongs to and the destination wallet that receives captured trees.
- **Data Sync & Upload** — background upload of growers, sessions, trees, location tracks, device config, and messages to the Treetracker API, plus image/data bundles to object storage.
- **Grower Messaging** — two-way messaging: direct chat, announcements, and surveys, synced from the API and persisted locally.
- **Dashboard, Map & App Settings** — grower-facing overview surfaces: sync-stats dashboard, map of captured trees, app settings, and language selection.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. Explore this snapshot in the hosted viewer:
<https://arnoldcastro5000.github.io/understand-greenstand/treetracker-android/>

To explore locally, load a graph file with the `/understand-anything:understand-dashboard` skill.

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
