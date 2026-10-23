# The shared resources of the code repos

A shared resource is a thing that several code repos use and that no code repo owns, other than
treetracker-infrastructure. This page says what each shared resource is, how a code repo uses
it, and who looks after it. It shows today's state: each fact links to the file that proves it,
at the snapshot that these docs describe. For how the code repos call each other at run time,
see the [ecosystem maps](../ARCHITECTURE.md).

<!-- BEGIN shared resources at a glance: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Resource | Code repos that use it |
|---|---|
| [Container registry](#container-registry) | 9 (8 push, 9 pull) |

<!-- END shared resources at a glance -->

## Container registry

The container registry stores the Docker images of the code repos that run in the Kubernetes
clusters. The images are in the `greenstand` namespace on Docker Hub.

### How a code repo uses it

When a change merges to a release branch, the build workflow of the code repo builds the image
and pushes it with the new version as its tag. The deploy step writes that tag into the
manifests, and the cluster pulls the image. A pull request does not push an image. You do not
need a Docker Hub login to work on a code repo.

<!-- BEGIN shared resource container-registry uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| images-api | push, pull | [build workflow](https://github.com/Greenstand/images-api/blob/9d761d1/.github/workflows/treetracker-api-build-deploy-dev.yml#L74-L84), [manifest](https://github.com/Greenstand/images-api/blob/9d761d1/deployment/base/deployment.yaml#L28) |
| treetracker-admin-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/.github/workflows/treetracker-admin-api-build-deploy.yml#L75-L84), [manifest](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/deployment/base/treetracker-admin-api-deployment.yaml#L28) |
| treetracker-airflow-dags | pull | [Airflow DAG 1](https://github.com/Greenstand/treetracker-airflow-dags/blob/a537231/migrate_captures_dag.py#L63), [Airflow DAG 2](https://github.com/Greenstand/treetracker-airflow-dags/blob/a537231/migrate_stakeholders_dag.py#L64) |
| treetracker-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-api/blob/85258c8/.github/workflows/treetracker-api-build-deploy-dev.yml#L104-L114), [manifest](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/deployment.yaml#L28) |
| treetracker-field-data | push, pull | [build workflow](https://github.com/Greenstand/treetracker-field-data/blob/a6dfe14/.github/workflows/treetracker-api-build-deploy-dev.yml#L109-L119), [manifest](https://github.com/Greenstand/treetracker-field-data/blob/a6dfe14/deployment/base/deployment.yaml#L28) |
| treetracker-query-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/.github/workflows/treetracker-query-api-build-deploy-dev.yml#L57-L67), [manifest](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/deployment/base/deployment.yaml#L29) |
| treetracker-tile-server | push, pull | [build workflow](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/.github/workflows/build-deploy.yml#L50-L59), [manifest](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/deployment/base/deployment.yaml#L39), [Dockerfile](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/Dockerfile#L1) |
| treetracker-wallet-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/.github/workflows/treetracker-wallet-api-build-deploy-dev.yml#L53-L63), [manifest](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/deployment/base/treetracker-wallet-api-deployment.yaml#L28) |
| treetracker-web-map-client | push, pull | [build workflow](https://github.com/Greenstand/treetracker-web-map-client/blob/42b3a9a/.github/workflows/dev-build-release.yaml#L70-L90), [manifest](https://github.com/Greenstand/treetracker-web-map-client/blob/42b3a9a/deployment/base/deployment.yaml#L29), [test workflow](https://github.com/Greenstand/treetracker-web-map-client/blob/42b3a9a/.github/workflows/deploy-main-channel-to-test.yaml#L55) |

<!-- END shared resource container-registry uses -->

The names that you see in the workflows and the manifests:

<!-- BEGIN shared resource container-registry names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Secret | `DOCKERHUB_TOKEN` |
| Secret | `DOCKERHUB_USERNAME` |
| Image | `greenstand/domain-migration-scripts` |
| Image | `greenstand/images-api` |
| Image | `greenstand/tile-server-base` |
| Image | `greenstand/treetracker-admin-api` |
| Image | `greenstand/treetracker-api` |
| Image | `greenstand/treetracker-field-data` |
| Image | `greenstand/treetracker-map-tile-server` |
| Image | `greenstand/treetracker-query-api` |
| Image | `greenstand/treetracker-wallet-api` |
| Image | `greenstand/treetracker-web-map-client` |
| Image | `greenstand/treetracker-web-map-client-dev` |
| Image | `greenstand/treetracker-web-map-client-test` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-02 to 2026-10-17).

<!-- END shared resource container-registry names -->

Notes:

- The image of treetracker-tile-server is `greenstand/treetracker-map-tile-server`, not the
  name of the repo.
- treetracker-web-map-client also pushes an image for its dev channel, and a manual workflow
  pushes one for its test channel. Docker Hub shows no public test image (checked 2026-10-23).
- The Dockerfile of treetracker-tile-server starts from `greenstand/tile-server-base`. No code
  repo builds that image.
- Two Airflow DAGs of treetracker-airflow-dags run jobs in the cluster from the image
  `greenstand/domain-migration-scripts`. No code repo of these docs builds that image.

### Who looks after it

No code repo and no Terraform file of the estate sets up the registry. The build workflows
read their Docker Hub credentials from the secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
For push access or a new image name, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).
