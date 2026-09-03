# Greenstand-Overview

Machine-generated documentation for [`Greenstand/Greenstand-Overview`](https://github.com/Greenstand/Greenstand-Overview),
the org's central onboarding and overview repo for the Treetracker project: contributor guide,
nonprofit bylaws, token model whitepaper, roadmap, team directory, BDD guide, and license/code-of-conduct
docs. This is the org's overview / onboarding repo, not a code service — it has no application code.

## Snapshot

- **Source commit:** [`6861717`](https://github.com/Greenstand/Greenstand-Overview/commit/68617178870590e198bd045e835e718562235e55)
- **Snapshot date:** 2026-09-03
- **Files analyzed:** 15
- **Graph:** 15 nodes, 7 edges, 5 architecture layers, 7-step guided tour
- **Domain graph:** 4 domains, 9 flows, 36 steps (documentation-described processes, not code-implemented flows)

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: what each document covers, architecture layers, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full document knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps modeled from documentation content. Powers the dashboard's domain view. |

## Business domains

- **Contributor Onboarding & Development Workflow** — project onboarding, BDD feature development, GitHub fork-and-pull.
- **Governance & Legal** — nonprofit governance structure, code-of-conduct enforcement.
- **Token Economy (Greenstand Token)** — token creation & verification, token trading lifecycle (whitepaper concept).
- **Product Strategy & Planning** — roadmap planning, issue-tracking navigation.

## Viewing the graphs

The JSON graphs render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore interactively, load a graph file with
the `/understand-anything:understand-dashboard` skill locally, or view it at:
https://arnoldcastro5000.github.io/understand-greenstand/Greenstand-Overview/

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
