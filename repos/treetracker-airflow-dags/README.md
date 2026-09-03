# treetracker-airflow-dags

Machine-generated documentation for [`Greenstand/treetracker-airflow-dags`](https://github.com/Greenstand/treetracker-airflow-dags),
Greenstand's Apache Airflow analysis/automation pipeline: Python DAGs schedule and trigger
data export, migration, reporting, web-map precompute, and species-identification jobs, backed
by a shared `lib/` of job modules over PostGIS/CKAN.

## Snapshot

- **Source commit:** [`a537231`](https://github.com/Greenstand/treetracker-airflow-dags/commit/a5372312efc52797b7a2f5cd620507ab65fff871)
- **Snapshot date:** 2026-09-02
- **Files analyzed:** 69
- **Graph:** 118 nodes, 214 edges, 6 architecture layers, 10-step guided tour
- **Domain graph:** 6 domains, 21 flows, 72 steps

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human onboarding guide: architecture, key concepts, guided tour, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. |
| [`meta.json`](./meta.json) | Analyzed-at timestamp, source commit, file count. |

## Business domains

- **Data Export** — monthly capture/grower/earnings exports; planter-info FTP upload.
- **Data Migration** — capture and stakeholder migration.
- **Reporting & Analytics** — country leaderboard, FCC contract earnings, reporting-schema population, session-time chopping, reporting-card cache warming.
- **Web-Map Precompute** — tile/cluster cache warming, cluster assignment, materialized-view refresh.
- **Species Identification** — batch inference pipeline over capture images.
- **Platform & Orchestration** — failure notifications, cron wrappers, author provisioning, wallet-token creation.

## Viewing the graphs

Interactive viewer: **https://arnoldcastro5000.github.io/understand-greenstand/treetracker-airflow-dags/**
(one graph per subpath; the site is rebuilt from these JSON files by the Pages workflow).

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md).
