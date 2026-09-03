# Onboarding Guide: treetracker-field-data

Machine-generated onboarding guide for the Greenstand **Field Data** service. Start here, then
open the interactive knowledge graph (`knowledge-graph.json`) and domain graph
(`domain-graph.json`) in the Understand-Anything dashboard.

## Project Overview

- **Name:** treetracker-field-data
- **Purpose:** A service that owns the raw tree-tracking data uploaded from devices via the
  treetracker app.
- **Languages:** JavaScript, SQL, YAML, JSON, Markdown, Dockerfile, Shell
- **Frameworks / platforms:** Express, Mocha, Docker, GitHub Actions
- **Architecture:** Multi-layer, MVC-like (Protocol → Service → Model → Repository) over **two**
  PostgreSQL databases (the app field-data database plus the legacy treetracker main database),
  publishing domain events through **RabbitMQ** (rascal / amqplib).
- **Runtime:** The HTTP API listens on port 3006 (`npm run server`).

The service is in the middle of a data migration. The legacy treetracker `trees` table still
acts as a source of device data, so several flows **dual-write** to both databases during the
transition.

## Architecture Layers

The graph groups 228 file-level nodes into 10 layers.

| Layer | Files | What lives here |
|---|---|---|
| **Protocol Layer** | 33 | Express routers, per-feature request handlers, Joi/Swagger schemas, app/server bootstrap, OpenAPI capture contract. The thin HTTP front door. |
| **Service Layer** | 13 | Stateless business services (captures, sessions, tracks, wallet registration, event replay, queue publication) plus shared error/pagination/enum utilities. |
| **Domain Model Layer** | 7 | Stateful domain models (RawCapture, DomainEvent, Session, Track, DeviceConfiguration, WalletRegistration, LegacyTree) that hold state and raise domain events. |
| **Repository Layer** | 10 | Knex-backed data-access repositories. All SQL against the field-data and legacy databases lives here, including the generic BaseRepository. |
| **Runtime Infrastructure** | 10 | Dual-database Knex clients, transactional sessions, the RabbitMQ/Rascal broker, and connection/environment config. |
| **Data & Persistence** | 94 | db-migrate SQL migrations and their table definitions, Knex seeds, static data fixtures (raw_capture, session, domain_event, track, wallet_registration, device_configuration). |
| **Deployment Infrastructure** | 27 | Docker image build and Kubernetes/kustomize overlays (base, dev, production) with SealedSecrets and Ambassador mappings. |
| **CI/CD & Tooling** | 15 | GitHub Actions build/test/deploy pipelines, semantic-release, lint, commit hooks, dev-setup tooling. |
| **Testing** | 13 | Mocha integration API specs, repository/app/seed unit specs, and database fixtures/helpers. |
| **Documentation** | 6 | README, semantic-release changelog, ADR, API docs, brand assets. |

## Key Concepts

- **Thin controllers, fat services.** Handlers validate the request (Joi schemas) and delegate to
  the service layer. Every feature (captures, tracks, sessions, wallets, device config, replay)
  repeats this pattern.
- **Services as factories.** Stateless services create the stateful Model objects and orchestrate
  work; they own cross-database transaction coordination.
- **Models raise events, not messages.** Domain models (e.g. `RawCapture`) emit `DomainEvent`
  records rather than talk to the queue directly. This keeps business rules independent of
  messaging infrastructure.
- **Outbox + RabbitMQ.** `DomainEvent` is an event-sourcing outbox record; the `domain_event`
  table is range-partitioned by year. `QueueService` / `RabbitMQ.js` publish capture events and
  subscribe for processing and replay.
- **Dual-database bridging.** `RawCaptureService` writes to the main field-data database and the
  legacy treetracker database inside dual transactions during the migration period.
- **Repository pattern.** `BaseRepository` is a generic Knex class (getById, filtered queries,
  count, update, create via a recursive where-clause builder) and is one of the most depended-on
  files in the project.

## Business Domains

Derived from the domain graph (6 domains, 15 flows, 60 steps):

- **Raw Capture Ingestion** (core) — create / reject / query captures with dual-database writes.
- **Session & Track Tracking** — capture sessions, session segments, and device tracks.
- **Device Configuration** — device registration and queries.
- **Wallet Registration** — idempotent wallet registration and queries.
- **Domain Events & Messaging** — outbox plus RabbitMQ publish / consume / replay.
- **Legacy Database Bridging** — legacy tree dual-write and ETL backfill.

## Guided Tour

Recommended reading order (also encoded in the graph's 12-step tour):

1. **Project Overview** — `README.md`. Learn what the service does and its layered architecture.
2. **Entry Point and Bootstrap** — `server/server.js`, `server/app.js`, `config/config.js`. The
   process entry point loads config, listens on port 3006, and closes Knex on shutdown; `app.js`
   wires middleware, Swagger, routes, error handling, and event handlers.
3. **Protocol Layer: Routes and Handlers** — `server/routes/index.js`,
   `server/routes/rawCaptureRoutes.js`, `server/handlers/rawCaptureHandler/index.js` and its
   `schemas.js`. URL → handler mapping with async error wrapping and Joi validation.
4. **Service Layer: Business Orchestration** — `server/services/RawCaptureService.js`,
   `QueueService.js`, `EventHandlerService.js`. Dual-transaction capture create/reject, RabbitMQ
   publish, and transactional event handling.
5. **Domain Model Layer** — `server/models/RawCapture.js`, `DomainEvent.js`, `SessionModel.js`.
   Models create/verify/reject captures and emit domain events.
6. **Repository Layer: Data Access** — `server/repositories/BaseRepository.js`,
   `RawCaptureRepository.js`, `EventRepository.js`. Where all SQL lives.
7. **Dual-Database Infrastructure** — `server/infra/database/knex.js`,
   `Sessions/Session.js`, `Sessions/BaseSession.js`. Two Knex clients and the transaction
   lifecycle.
8. **Messaging: RabbitMQ Event Publishing** — `server/infra/RabbitMQ/RabbitMQ.js` and
   `config/index.js`. Rascal broker wrapper plus the vhost/exchange/queue/binding topology.
9. **Database Schema and API Contract** — `database/migrations/sqls/*-createCaptures-up.sql`,
   `*-domainEvents-up.sql`, `api.json`. The raw_capture table, partitioned domain_event outbox,
   and the OpenAPI `/captures` contract.
10. **Containerization and Kubernetes Deployment** — `Dockerfile`,
    `deployment/base/deployment.yaml`, `deployment/base/kustomization.yaml`.
11. **CI/CD Pipelines** — `.github/workflows/pull-request-ci.yml`,
    `.github/workflows/treetracker-api-build-deploy-dev.yml`. PR test gate and
    semantic-release build/deploy on push to main.
12. **Integration Tests** — `__tests__/raw-capture-api.spec.js`, `events-api.spec.js`. Full-stack
    Mocha/Chai/Supertest suites against real Postgres and RabbitMQ.

## File Map (by layer)

- **Bootstrap / config:** `server/server.js` (entry point), `server/app.js` (Express wiring),
  `config/config.js` (primary + legacy DB connection strings), `knexfile.js`.
- **Protocol:** `server/routes/` (feature routers), `server/handlers/<feature>Handler/`
  (index + schemas), `server/handlers/swaggerDoc.js`, `api.json` (OpenAPI 3).
- **Service:** `server/services/RawCaptureService.js`, `QueueService.js`,
  `EventHandlerService.js`, `ReplayEventService.js`, `SessionService.js`,
  `DeviceConfigurationService.js`, plus `server/utils/`.
- **Model:** `server/models/RawCapture.js`, `DomainEvent.js`, `SessionModel.js`, `Track.js`,
  `DeviceConfiguration.js`, `WalletRegistration.js`, `LegacyTree.js`.
- **Repository:** `server/repositories/BaseRepository.js`, `RawCaptureRepository.js`,
  `EventRepository.js`, plus legacy planter/tree/attribute repositories.
- **Runtime infra:** `server/infra/database/knex.js`, `Sessions/BaseSession.js`, `Session.js`,
  `LegacySession.js`, `server/infra/RabbitMQ/RabbitMQ.js`, `config/index.js`.
- **Data & persistence:** `database/migrations/` (db-migrate JS + paired SQL under `sqls/`),
  `database/seeds/`, `database/seeds/data/` fixtures, `database/db_init.sql`.
- **Deployment:** `Dockerfile`, `deployment/base/`, `deployment/dev/`, `deployment/production/`
  (kustomize overlays, SealedSecrets, Ambassador mappings).
- **CI/CD:** `.github/workflows/`, `.releaserc`, `commitlint.config.js`, `scripts/`.
- **Tests:** `__tests__/` (integration specs + fixtures), `server/**/*.spec.js` (unit specs).

## Complexity Hotspots

Approach these carefully; they carry the most logic or size:

- `server/services/RawCaptureService.js` — orchestrates capture create/reject across main and
  legacy databases with dual transactions and queue publication.
- `server/models/RawCapture.js` — core domain model; creates, verifies, rejects captures and
  emits domain events.
- `server/repositories/BaseRepository.spec.js` — dense unit suite for the generic repository
  (query building, filtering, count, update, create).
- `__tests__/raw-capture-api.spec.js` — comprehensive raw-capture API integration suite (upload,
  validation, legacy-API service paths).
- `api.json`, `docs/api/spec/api.json`, `docs/api/spec/treetracker-field-data.yaml` — the OpenAPI
  contracts for the raw-captures / session / wallet surfaces.
- `.github/workflows/treetracker-api-build-deploy-dev.yml` — the main CI/CD pipeline
  (test → semantic-release → build/push → deploy).
- `database/seeds/data/capture_match_raw_captures.js`,
  `database/seeds/data/duplicate_raw_captures.js` — very large static data fixtures.
- `CHANGELOG.md` — auto-generated semantic-release history.

## Next Steps

- Explore `knowledge-graph.json` and `domain-graph.json` in the Understand-Anything dashboard
  (`/understand-anything:understand-dashboard`).
- To ask questions about the code, use `/understand-anything:understand-chat`.
