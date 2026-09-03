# Onboarding Guide: treetracker-wallet-app

Machine-generated onboarding guide for `Greenstand/treetracker-wallet-app`, based on a
static knowledge-graph analysis of the codebase (commit `51ae4e3`, snapshot 2026-09-03).

## 1. Project Overview

**treetracker-wallet-app** is a secure digital token wallet platform built by Greenstand
for transparent, verifiable tree-planting and forest-management token transfers. It is a
**Yarn v4 workspace monorepo** containing:

- A **Next.js** web app (`apps/web`)
- An **Expo React Native** mobile app (`apps/native`)
- A **NestJS** backend service (`apps/user`)
- A **Cucumber/WebdriverIO** end-to-end BDD test suite (`apps/bdd`)
- Five shared TypeScript packages (`packages/*`)

**Languages:** TypeScript, JavaScript, CSS, HTML, YAML, Dockerfile, Markdown, JSON, Gherkin (`.feature`)
**Frameworks/tooling:** React, Next.js, Expo/React Native, NestJS, Jotai, Jest, Cypress,
WebdriverIO/Cucumber, Docker, GitHub Actions, Keycloak

Prerequisites per the README: Node.js v20+, Yarn v4+, Docker (for backend development).

## 2. Architecture Layers

The knowledge graph groups the 415 analyzed files into 8 architectural layers:

### Web App (123 files)
The Next.js wallet web application: app-router pages, UI components, Keycloak-backed
auth, and client-side context/utilities for managing tree-planting token wallets.
Key files:
- `apps/web/src/app/layout.tsx` — root Next.js layout (MUI cache provider, theme, Keycloak provider)
- `apps/web/src/auth/keycloak.ts` — browser-only Keycloak instance wrapper (init/login/logout)
- `apps/web/src/components/header/Header.tsx` — top app header with expandable search
- `apps/web/src/context/HeaderContext.tsx` — shared header search state
- `apps/web/src/app/(protected)/home/page.tsx` — wallet/token balances + recent activity
- `apps/web/src/app/(protected)/search/page.tsx` — wallet search + `WalletDetailModal`
- `apps/web/src/components/KeycloakProvider.tsx` — initializes Keycloak on mount

### Native Mobile App (89 files)
The Expo React Native mobile wallet app: screens, UI components, hooks, and navigation
for the on-the-go token wallet experience.
Key files:
- `apps/native/app/_layout.tsx` — Expo Router root layout (fonts, splash screen)
- `apps/native/theme/index.ts` / `apps/native/constants/Colors.ts` — design tokens
- `apps/native/app/(tabs)/home/index.tsx` — main dashboard screen
- `apps/native/app/(tabs)/wallet/[walletId].tsx` — dynamic wallet-detail screen
- `apps/native/app/scancode.tsx` — QR scanner for reading tree-transfer codes
- `apps/native/components/HeaderSearch.tsx` — shared header/search component
- `apps/native/components/wallet/WalletCreateDrawer.tsx` — wallet-creation form

### Backend Service (37 files)
The NestJS backend handling authentication, user management, and queue-listener
processing for wallet token transfers.
Key files:
- `apps/user/src/main.ts` — bootstrap (Swagger, CORS, global validation pipes)
- `apps/user/src/app.module.ts` — root module wiring user, queue-listener, and auth modules
- `apps/user/src/user/user.service.ts` — login/registration/profile via Keycloak OIDC + admin REST APIs
- `apps/user/src/user/user.controller.ts` — REST endpoints (login, register, check, getMe)
- `apps/user/src/auth/auth.service.ts` — cached Keycloak service-account bearer token
- `apps/user/src/queue-listener/queue-listener.service.ts` — subscribes to wallet-creation notifications

### BDD Test Suite (41 files)
Cucumber/WebdriverIO end-to-end tests (features, step definitions, docs) covering both
web and native wallet flows.
Key files:
- `apps/bdd/utils/seed.ts` — test-data seeding (Keycloak accounts + wallets)
- `apps/bdd/utils/artifacts.ts` — test-artifact directory layout (reports, videos)
- `apps/bdd/scripts/watch.ts` — interactive BDD test watcher CLI
- `apps/bdd/wdio.base.conf.ts` — shared WebdriverIO/Cucumber base config
- `apps/bdd/features/step-definitions/steps.ts` — Given/When/Then handlers (login, register, wallet, transfer)
- `apps/bdd/features/*.feature` — Gherkin specs (create-wallet, send-token, share-token, register, login, ...)

### Shared Packages (83 files)
Reusable workspace libraries shared across apps:
- **`packages/wallet`** — wallet API client + React hooks (`createWallet`, `sendTransfer`, `useGetWallets`, ...); `src/utils/config.ts` resolves the API base URL for web vs. native runtimes
- **`packages/core`** — Jotai-based shared state/hooks used by web and native (`loginAtom`, `registerAtom`, `tokenAtom`, search atoms)
- **`packages/keycloak`** — shared Keycloak client functions (`fetchTokenFromKeycloak`, `createAccountFromKeycloak`, `deleteAccountFromKeycloak`)
- **`packages/queue`** — small Postgres-backed pub/sub client (`subscribe`, `publish`, `ack`)
- **`packages/common`** — small shared utilities (e.g. `sendEmail`)

### Configuration (16 files)
Root and shared project configuration: `package.json` (Yarn v4 workspace root),
`packages/config` (shared ESLint/Prettier/tsconfig presets), root `tsconfig.json`
(project references composing all apps/packages), `.yarnrc.yml`, `.releaserc.js`.

### CI/CD & Infrastructure (22 files)
GitHub Actions pipelines for build/test/deploy, plus the Kubernetes manifests and
Dockerfile stages that deploy the backend service.
- `apps/user/Dockerfile` — multi-stage build (builder → slim production image)
- `apps/user/deployment/base/*.yaml` — Kustomize base (Deployment, Service, Namespace, ClusterRole/Binding, Ambassador mapping)
- `.github/workflows/pr-ci-cd-all.yml` — repo-wide PR checks (Prettier, lint, commitlint)
- `.github/workflows/ci-cd-pr-bdd-android.yml` / `ci-cd-pr-bdd-wallet.yml` — BDD e2e pipelines (Android emulator / web)
- `.github/workflows/ci-cd-deploy-web-prod.yml` / `ci-cd-deploy-web-test.yml` / `static-website-deploy-dev.yml` — static-export web deploys

### Documentation (5 files)
`README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, GitHub issue/PR templates.

## 3. Key Concepts

- **Keycloak-centralized identity.** Both `packages/keycloak` (client-side) and
  `apps/user/src/auth` (backend service-account token) wrap the same Keycloak OIDC
  server. Web and native both delegate login/registration to it via `packages/core`'s
  Jotai atoms.
- **Event-driven wallet provisioning.** New user accounts don't get a wallet via a
  direct API call — `packages/queue` (Postgres LISTEN/NOTIFY-style pub/sub) carries a
  "wallet-creation" event from the user service to a downstream consumer, decoupling
  account creation from wallet creation.
- **Shared business logic via workspace packages.** `packages/wallet` and
  `packages/core` are the seams between the two frontends — both the Next.js web app
  and the Expo native app import the same API client functions and React
  hooks/atoms, so wallet/transfer/auth logic is written once.
- **Action tokens for wallet sharing.** `generateActionToken` / `redeemActionToken`
  (in `packages/wallet`) and `apps/web/src/utils/actionToken.ts` implement a
  link-based token-sharing flow (e.g. "share a wallet via email/link" without a login).
- **Runtime-aware API base URL.** `packages/wallet/src/utils/config.ts` resolves the
  wallet API's base URL differently for Next.js (public env var) vs. native
  (Expo config) — a common pain point when debugging cross-platform networking.
- **Monorepo tooling.** Yarn v4 workspaces (`apps/*`, `packages/*`), a shared
  `packages/config` ESLint/Prettier/tsconfig preset, and root project-references
  `tsconfig.json` composing all sub-projects.

Most common node tags across the graph: `component` (197), `configuration` (72),
`wallet` (67), `utility` (60), `ui` (58), `keycloak` (53), `auth`/`authentication` (80
combined), `state-management` (34), `navigation` (34), `transfer` (33), `bdd`/`cypress`/
`e2e`/`testing` (test-related tags appear on well over 100 nodes — the project has a
heavy investment in BDD/e2e coverage relative to unit tests).

## 4. Guided Tour

A 14-step guided tour is encoded in `knowledge-graph.json` (`tour[]`). Recommended
reading order for a new contributor:

1. **Project Overview** — start with `README.md`.
2. **Monorepo Workspace Structure** — root `package.json` defines the Yarn v4
   workspace (`apps/*`, `packages/*`) and aggregates per-app scripts.
3. **Web App Entry Point** — `apps/web/src/app/layout.tsx` + `apps/web/src/auth/keycloak.ts`.
4. **Native App Entry Point** — `apps/native/app/_layout.tsx` + `apps/native/app/index.tsx`.
5. **Backend Bootstrap** — `apps/user/src/main.ts` + `apps/user/src/app.module.ts`.
6. **Shared Auth State (Jotai Core Package)** — `packages/core/src/atoms/auth/*`.
7. **Wallet API Client Package** — `packages/wallet/src/index.ts` + its api/hooks/types.
8. **Keycloak Integration** — `packages/keycloak`, `apps/user/src/auth/auth.service.ts`, `apps/user/src/user/user.service.ts`.
9. **Event-Driven Wallet Creation (Queue Package)** — `packages/queue/index.js` +
   `apps/user/src/queue-listener/*`.
10. **Web App: Wallet and Transfer Screens** — protected home/wallet/send pages.
11. **Native App: Wallet and Transfer Screens** — home/wallet/transfer tabs (mirrors #10).
12. **End-to-End BDD Testing** — `apps/bdd/README.md`, `send-token.feature`, `steps.ts`.
13. **Containerizing and Deploying the Backend** — `apps/user/Dockerfile` + K8s `deployment.yaml`.
14. **CI/CD Pipelines** — `pr-ci-cd-all.yml` + `ci-cd-deploy-web-prod.yml`.

## 5. File Map (by layer)

See section 2 above for the curated key-files list per layer. The full file inventory
(415 files, all summarized) is in `knowledge-graph.json` under `nodes[]` — filter by
`type` in (`file`, `config`, `document`, `service`, `pipeline`, `resource`) and cross-
reference `layers[].nodeIds` for the layer assignment of any given file.

## 6. Complexity Hotspots

Of 416 file-level nodes: 278 simple, 111 moderate, 27 complex. Approach these complex
files carefully — they carry the most business logic, state, or cross-cutting concerns:

- `apps/bdd/features/step-definitions/steps.ts` — large BDD step-definition file (login, registration, wallet, transfer handlers)
- `apps/native/app/(tabs)/home/index.tsx` — main native dashboard (balances, summaries, guided tour)
- `apps/native/app/onboarding/index.tsx` — swipeable onboarding carousel
- `apps/native/app/scancode.tsx` — QR scanner parsing transfer payloads
- `apps/web/src/app/(protected)/search/page.tsx` — wallet search + detail modal
- `apps/web/src/components/WalletDetailModal.tsx` — large modal (deposit/withdraw, sub-views)
- `apps/user/src/user/user.controller.spec.int.ts` — integration tests against real/test Keycloak
- `apps/user/src/user/user.service.ts` — Keycloak OIDC + admin REST integration
- `apps/native/app/(tabs)/settings/index.tsx`, `apps/native/app/(tabs)/wallet/[walletId].tsx`
- `apps/native/components/ui/common/CustomTextInput.tsx` — animated floating-label input
- `apps/native/components/wallet/WalletActivity.tsx`, `WalletFilterModal.tsx`
- `apps/web/src/app/(protected)/settings/account/page.tsx`
- `apps/bdd/features/step-definitions/share-token.steps.ts`, `apps/bdd/utils/seed.ts`, `apps/bdd/utils/artifacts.ts`, `apps/bdd/wdio.base.conf.ts`
- `.github/workflows/ci-cd-pr-bdd-android.yml`, `ci-cd-pr-bdd-wallet.yml` — the two largest CI pipelines (emulator/Appium setup, multi-service orchestration)

## 7. Business Domains

A companion domain-flow analysis (`domain-graph.json`) identifies 4 business domains,
14 flows, and 64 process steps:

- **Wallet Management** (3 flows) — create/view/update a wallet; event-driven auto-provisioning on account creation
- **Token Transfer** (5 flows) — send/accept/decline/cancel transfers, share-via-link (action tokens), transfer/token history
- **Search & Discovery** (2 flows) — search wallets, display wallet QR code
- **Authentication & Identity** (4 flows) — registration, login, session token management, backend service-to-service auth

Cross-domain interactions: Authentication triggers Wallet auto-provisioning via the
queue; session tokens from Authentication authorize Token Transfer; Wallet Management
supplies transfer endpoints; Search & Discovery depends on Wallet data for recipient
selection.

---
*Generated by Understand-Anything from a static analysis of the codebase. Not a
substitute for reading the actual source — treat summaries as a map, not the territory.*
