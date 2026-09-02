# node-mapnik-1

Machine-generated documentation for [`Greenstand/node-mapnik-1`](https://github.com/Greenstand/node-mapnik-1).

> **This repo is a fork.** `node-mapnik-1` is Greenstand's fork of upstream
> [node-mapnik](https://github.com/mapnik/node-mapnik). The Greenstand-authored value is the
> PostGIS-backed Express **tile server** under `greenstand/` that renders Tree Tracker web-map
> tiles; the `src/` C++ layer is upstream Mapnik binding code, documented only as the rendering
> engine the server sits on. The large upstream `test/` fixtures and binary assets were
> excluded from analysis.

## Snapshot

- **Source commit:** [`35fff37`](https://github.com/Greenstand/node-mapnik-1/commit/35fff37f7f10af483a128b199520b2264164d1fb)
- **Snapshot date:** 2026-09-02
- **Files analyzed:** 206 (303 upstream test/asset files excluded)
- **Graph:** 465 nodes, 617 edges, 7 architecture layers, 12-step guided tour
- **Domain graph:** 6 domains, 9 flows, 33 steps

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human onboarding guide (fork-aware): architecture, the request→tile pipeline, guided tour, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. |
| [`meta.json`](./meta.json) | Analyzed-at timestamp, source commit, file count. |

## Business domains

- **Tile Rendering** — request → envelope → build map/load style → query → render → PNG.
- **Map Query Building** — the `SQLCase*` query-builder hierarchy selecting PostGIS queries by zoom/settings.
- **Style & Projection Config** — Mapnik XML style generation + spherical-mercator projection.
- **Database Access** — pooled queries with LRU cache and request coalescing (`PGPool`).
- **Deployment & Delivery** — Docker image build/publish + Kustomize dev/prod/test deploy.
- **Native Rendering Engine** (supporting) — the upstream C++ Mapnik bindings.

## Viewing the graphs

Interactive viewer: **https://arnoldcastro5000.github.io/understand-greenstand/node-mapnik-1/**

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). Analysis excluded the upstream
`test/`, `bench/`, `docs/`, `deps/`, examples, and binary assets via `.understandignore`.
