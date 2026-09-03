# treetracker-infrastructure

Machine-generated documentation for [`Greenstand/treetracker-infrastructure`](https://github.com/Greenstand/treetracker-infrastructure),
the infrastructure-as-code that provisions and operates the Greenstand treetracker platform across
DigitalOcean and AWS: Kubernetes (DOKS) clusters, a managed PostgreSQL data tier, API gateway and
identity, application and data workloads, observability, and operational tooling. Primary language
is Terraform/HCL.

## Snapshot

- **Source repo:** [`Greenstand/treetracker-infrastructure`](https://github.com/Greenstand/treetracker-infrastructure)
- **Source commit:** [`a740d11`](https://github.com/Greenstand/treetracker-infrastructure/commit/a740d11ffe60cb8d7f05b5006cf80583bd267aa5)
- **Snapshot date:** 2026-09-03
- **Primary language:** Terraform / HCL (HCL parsed to 306 resource nodes)
- **Files analyzed:** 332
- **Graph:** 507 nodes, 400 edges, 10 architecture layers, 13-step guided tour
- **Domain graph:** 6 domains, 17 flows, 55 steps
- **Interactive viewer:** https://arnoldcastro5000.github.io/understand-greenstand/treetracker-infrastructure/

## Contents

| File | What it is |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | Human-readable onboarding guide: architecture layers, key concepts, guided tour, file map, complexity hotspots. Start here. |
| [`knowledge-graph.json`](./knowledge-graph.json) | Full code knowledge graph (nodes, edges, layers, tour). Powers the Understand-Anything dashboard. |
| [`domain-graph.json`](./domain-graph.json) | Business domain graph: domains, flows, and process steps. Powers the dashboard's domain view. |
| [`meta.json`](./meta.json) | Analyzed-at timestamp, source commit, and file count. The static viewer probes it for the staleness banner. |

## Business domains

- **Cloud & Cluster Provisioning** — DOKS/Terraform, IAM/DNS/bastion, Sealed Secrets.
- **Database Platform** — managed PostgreSQL, per-microservice schema grants, backups.
- **Ingress & Identity** — Ambassador API gateway, Keycloak.
- **Application & Data Platform** — RabbitMQ, Airflow, Solr/CKAN/OpenProject, static web apps and CDN.
- **Observability & Alerting** — Prometheus/Grafana, Loki, Jaeger.
- **Platform Operations & CI** — cluster access scripts, pre-commit and GitHub Actions.

## Viewing the graphs

Open the interactive viewer at
https://arnoldcastro5000.github.io/understand-greenstand/treetracker-infrastructure/.
The JSON graphs also render in the Understand-Anything dashboard (one graph at a time). This repo
ships the graph data, not a live dashboard. To explore locally, load a graph file with the
`/understand-anything:understand-dashboard` skill.

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the source repo,
run `/understand` then `/understand-domain` then `/understand-onboard`, and replace this directory.
