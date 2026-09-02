# Onboarding Guide — node-mapnik-1

_Generated from the Understand-Anything knowledge graph. Source commit `35fff37`._

> **This repo is a fork.** `node-mapnik-1` is Greenstand's fork of upstream
> [node-mapnik](https://github.com/mapnik/node-mapnik). The **Greenstand-authored** value is
> the PostGIS-backed tile server under `greenstand/`; the `src/` C++ layer is **upstream**
> Mapnik binding code, documented here only as the rendering engine the server sits on.
> The large upstream `test/` fixtures and binary assets were excluded from analysis.

## Project Overview

A Node.js tile server that renders Greenstand's Tree Tracker web-map tiles. An Express app
takes a tile request, chooses a PostGIS SQL query by request settings, injects it into a
Mapnik XML style, and renders a PNG (or vector tile) through the native Mapnik bindings.

- **Languages:** C++ (upstream bindings), JavaScript (the Greenstand server), plus shell,
  Python, YAML, Dockerfile
- **Frameworks:** Express, Jest, Docker, GitHub Actions, Mapnik

## Architecture Layers

| Layer | Files | What it holds |
|---|---|---|
| **Greenstand Tile Server** | 30 | The fork's own code: `app.js` (Express entry), `Map.js` (request orchestrator), `PGPool.js` (pooled DB access), `XMLConfig.js` (Mapnik style + SQL injection), the `sqls/` query-builder classes, styles/GeoJSON. **Start here.** |
| **Tests** | 14 | Jest unit + integration specs for the tile server (query builders, config, DB, rendering). |
| **Native Mapnik Bindings** | 73 | Upstream C++ Node-API source (`src/`) binding Mapnik: datasource, map, image, vector-tile, grid, feature, etc. |
| **Binding Loader & CLI** | 6 | Upstream JS addon loader (`lib/`) + `mapnik-*` CLI tools. |
| **Build & Packaging Scripts** | 27 | Shell scripts to build/publish/package the native addon; C++ style tooling. |
| **Deployment & CI/CD** | 31 | Kustomize K8s overlays (`deployment/`, `deployment-next/`: base/dev/prod/test) + GitHub Actions workflows. |
| **Project Config & Docs** | 25 | Root config, gyp/Makefile/Dockerfile, package.json, docs. |

## Key Concepts

- **Request → tile pipeline.** `greenstand/app.js` receives a tile request; `Map.js` inspects
  the request and picks a SQL query-builder; `XMLConfig.js` injects that SQL into a Mapnik XML
  style; Mapnik (native) renders the tile.
- **SQL query-builder hierarchy.** `greenstand/sqls/SQLCase1..4` (+ zoom-target, timeline,
  wallet, V2 variants) build the PostGIS query per zoom/settings, computing cluster radius by
  zoom. `Map.js` is the selector.
- **Connection pooling with caching.** `PGPool.js` wraps a Postgres pool with an LRU cache and
  per-query request coalescing (avoids duplicate concurrent queries).
- **Style templating.** `config.js` + `xml.js`/`xml2.js` hold Mapnik XML style templates;
  `postgis.xml` is the layer whose datasource query is rewritten at request time.
- **Native engine below.** `lib/mapnik.js` loads the compiled C++ addon (`src/`); the fork
  does not modify the rendering core, it drives it.

## Guided Tour

1. **Project Overview** — README: what the fork is and does.
2. **Tile Server Entry Point** — `greenstand/app.js`: Express app turning a request into a tile.
3. **Configuration and Projection** — `config.js` (Mapnik XML style) + `sphericalmercator.js` (projection).
4. **Map Controller** — `Map.js`: inspects the request and orchestrates the render.
5. **Database Connection Pooling** — `PGPool.js`: pool + LRU cache + query coalescing.
6. **SQL Query Builders** — `greenstand/sqls/`: the query-builder classes `Map.js` chooses between.
7. **Mapnik Style and XML Injection** — `XMLConfig.js`: injects the chosen SQL into the Mapnik XML.
8. **Mapnik Stylesheets and Data** — `postgis.xml` and the style/GeoJSON assets.
9. **Native Mapnik Bindings** — `lib/mapnik.js` loading the upstream C++ addon (rendering engine).
10. **Packaging and Containerization** — `package.json` + `Dockerfile` (native build wiring).
11. **Kubernetes Deployment** — Kustomize overlays under `deployment/`.
12. **CI/CD Pipelines** — `build-deploy.yml` and the per-env deploy workflows.

## Complexity Hotspots

Greenstand code first (103 files rated moderate+ overall):

- **`greenstand/app.js`** (complex) — the Express entry; builds Mapnik map instances per request.
- **`greenstand/config.js`** + **`xml.js`/`xml2.js`** (complex) — Mapnik XML style generation and templates.
- **`greenstand/sqls/SQLCase3.js`** (complex) — base clustered-map query builder (cluster radius by zoom).
- **`greenstand/PGPool.js`** (moderate) — pooling + LRU cache + coalescing; concurrency-sensitive.
- **`greenstand/sphericalmercator.js`** (moderate) — projection math; precached per-zoom constants.
- **`greenstand/trees.json`** (complex) — large GeoJSON dataset (data, low logic).
- The `src/` C++ binding files are individually complex but are **upstream**; treat them as the
  rendering engine, not code to change here.

---

_Regenerate with `/understand` then `/understand-domain` then `/understand-onboard`. See `docs/regenerating.md` in the docs repo. Analysis excluded the upstream `test/` fixtures and binary assets._
