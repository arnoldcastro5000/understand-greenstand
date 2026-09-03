# Onboarding Guide — treetracker-web-map-client (Treetracker Web Map)

_Generated from the Understand-Anything knowledge graph. Source commit `0f4d5b0`._

## Project Overview

The **Treetracker Web Map** is the public-facing map at [treetracker.org](https://www.treetracker.org).
It displays the location and details of every tree tracked in the Greenstand reforestation network,
along with planter, organization, and blockchain wallet/token provenance data. It is a Next.js 12 /
React 17 single-page application rendering an interactive Leaflet map, styled with Material UI 5, and
authenticated against Keycloak via OIDC.

- **Languages:** JavaScript, JSON, YAML, CSS, HTML, Dockerfile, Markdown
- **Frameworks:** Next.js, React, Docker, Jest, GitHub Actions (Cypress and MUI are used extensively
  in code but are not repo-level "frameworks" per the scanner)
- **Entry point:** `src/pages/_app.js` (Next.js custom App component — wires auth, theme, drawer, and
  map providers around every page)

The app is organized around Next.js file-based routing: entity detail **pages** (`src/pages/**`) render
**layout** components that host the shared **map** and **navigation** chrome, drawing data through a thin
**API client** layer (`src/models/api.js`) backed by the external `treetracker-query-api` service. React
**context/hooks** carry cross-cutting state (map instance, theme, config, drawer, dashboard).

## Architecture Layers

| Layer | Files | What it holds |
|---|---|---|
| **UI Components & Assets** | 148 | React components rendering the map, tree/planter/organization/wallet cards, dashboards, search, and the theme "playground" UI; the DesignSandbox theme-audit page; SVG icon components; public static assets. |
| **Pages & Routing** | 20 | Next.js file-based route entry points (trees, planters, organizations, wallets, tokens, admin, search, top) plus the top-level map context and global stylesheet. |
| **Hooks & Context (State Layer)** | 21 | Custom hooks (`contextHooks`, `cwmHooks`, `globalHooks`) and React context providers (config, dashboard, playground, theme, drawer) managing cross-component state. |
| **Data & Models** | 24 | API client (`api.js`), domain models (`MapModel`, `entity`, `pathResolver`), reducers, shared utilities, and the MSW mock server used to fake the API in dev/test. |
| **Test Suite** | 36 | Cypress e2e/integration/unit tests with fixtures and support/plugin files, plus Jest global setup and Cypress/Jest config. |
| **Infrastructure & Deployment** | 76 | Dockerfiles; five parallel Kustomize deployment overlays (`deployment`, `-alpha`, `-beta`, `-main`, `-next`) each with base + dev/test/prod overlays; GitHub Actions CI/CD workflows; Husky git hooks. |
| **Project Configuration & Tooling** | 19 | Env files, lint/format/commitlint config, package manifests, IDE artifacts, one codemod script. |
| **Documentation & API Specs** | 35 | README, CHANGELOG, GitHub issue/PR templates, OpenAPI specs (`doc/web-map-api.yaml`, `doc/web-map-router.yaml`) with their JSON example fixtures. |

## Key Concepts

- **URL is the source of truth for map state.** `src/models/pathResolver.js` resolves and updates the
  browser path/query as users click trees or pan/zoom, so every view is shareable and restorable from a URL.
- **One API client, many consumers.** `src/models/api.js` centralizes every axios call to the backend
  `treetracker-query-api` (trees, planters, organizations, growers, wallets, tokens). Pages call it directly
  in `getStaticProps`/`getServerSideProps`.
- **Three responsive layout variants.** `Layout.js` (desktop split-pane), `LayoutMobile.js` (stacked,
  dynamically-loaded Navbar/Drawer), and `LayoutEmbed.js` (embed mode, detected via `useEmbed`) all wrap the
  same map + Timeline + zoom controls, selected by viewport/embed context.
- **Context-driven cross-cutting state.** `mapContext.js` exposes the shared Leaflet map instance;
  `themeContext.js` builds the light/dark MUI theme (with live-preview support for the admin theme
  playground); `dashboardContext.js` + `config.reducer.js` hold admin-editable branding/nav/map config,
  persisted to local storage.
- **Legacy vs. current component pairs.** Several components have an active and a deprecated twin still
  present in the tree — `Share.js` (current) vs. `ShareDeprecated.js`, and `App.js`/`DrawerDeprecated.js`/
  `LayoutDashboard.js`/`LayoutMobileB.js`/`LayoutMobileC.js` are flagged `legacy`/`deprecated` in the graph
  (hardcoded API keys, disabled SSR integrations, or byte-identical duplicates). Check a component's tags
  before building on it.
- **Five parallel deployment environments.** `deployment/`, `deployment-alpha/`, `deployment-beta/`,
  `deployment-main/`, and `deployment-next/` are near-identical Kustomize trees (base + development/test/prod
  overlays) mapping to different branches/subdomains (e.g. `alpha-map`, `beta-map`, `next-map.treetracker.org`).
- **MSW mocks the backend in dev and test.** `src/mocks/{browser,server,handlers,index}.js` intercept API
  calls; enable via `NEXT_PUBLIC_API_MOCKING=enabled` (`npm run dev:mock`) or the bundled `cypress-watch-and-reload`
  test setup.

## Guided Tour

Follow these steps in order to learn the codebase end to end:

1. **Project Overview** — Read the `README.md` for project description, dev environment setup, and TDD workflow.
2. **Application Entry Point** — `src/pages/_app.js` wraps every page with global providers (auth, theme, drawer, map context) and the responsive layout variant.
3. **Tech Stack & Dependencies** — `package.json` (Next.js 12, React 17, MUI 5, Leaflet, `treetracker-web-map-core`, `react-oidc-context`).
4. **The Map Domain Model** — `src/mapContext.js` exposes the shared map instance; `src/models/MapModel.js` wraps Leaflet, tracking markers/viewport and the directional-arrow-to-nearest-tree algorithm.
5. **Fetching Domain Data** — `src/models/api.js` (all backend HTTP calls) and `src/models/entity.js` (fetch an entity by id/wallet/map name).
6. **URL as Application State** — `src/models/pathResolver.js` keeps the URL in sync with map interactions.
7. **Responsive Layouts** — `Layout.js`, `LayoutMobile.js`, `LayoutEmbed.js`.
8. **Navigation & the Details Drawer** — `Navbar.js`, `Drawer.js` (swipeable bottom sheet with custom touch-drag handling).
9. **Entity Detail Pages** — `pages/trees/[treeid].js`, `planters/[planterid].js`, `organizations/[organizationid].js`, `wallets/[walletid].js`.
10. **The Search Feature** — `components/search/Search.js`, `SearchInput.js`, `mockApi.js`.
11. **Admin Dashboard Configuration** — `context/dashboardContext.js`, `models/config.reducer.js`, `pages/admin/global.js`.
12. **Theming System** — `context/themeContext.js`, `pages/admin/theme.js` (live theme playground).
13. **The API Contract** — `doc/web-map-api.yaml` (OpenAPI spec for the backend query API).
14. **Containerization, Deployment & CI** — `Dockerfile`, `deployment/base/deployment.yaml`, `.github/workflows/pull-request-ci.yml`.

## File Map (by layer)

- **UI Components & Assets:** `src/components/{Layout,LayoutMobile,LayoutEmbed,Navbar,Drawer,Home,Timeline,
  TreeInfoDialog,Share,LeaderBoard,CustomWorldMap,GlobalMapLayout}.js`, `src/components/common/**`,
  `src/components/dashboard/**`, `src/components/playground/**` (theme customization controls),
  `src/components/search/**`, `src/DesignSandbox/**`, `src/images/**` (SVG icons), `public/**`
- **Pages & Routing:** `src/pages/_app.js`, `_document.js`, `index.js`, `top.js`, `search.js`, `filter.js`,
  `trees/[treeid].js`, `planters/[planterid].js`, `organizations/[organizationid].js`,
  `wallets/[walletid].js`, `tokens/[tokenid].js`, `v2/captures/[captureid].js`, `admin/{index,global,theme}.js`,
  `404.js`, `500.js`, `_error.js`, `src/mapContext.js`, `src/style.css`
- **Hooks & Context:** `src/context/{configContext,dashboardContext,playgroundContext,themeContext,
  DrawerContext}.js`, `src/hooks/globalHooks/**` (useMobile, useEmbed, useFullscreen, useLocalStorage,
  useClipboard), `src/hooks/contextHooks/**`, `src/hooks/cwmHooks/**`
- **Data & Models:** `src/models/api.js`, `entity.js`, `pathResolver.js`, `MapModel.js`, `utils.js`,
  `config.reducer.js`, `apiPaths.js`, `oidcConfig.js`, `mapConfig.js`, `src/mocks/**`
- **Test Suite:** `cypress/tests/{e2e,integration,units}/**`, `cypress/fixtures/**`, `cypress/support/**`,
  `cypress/plugins/**`, `cypress.config.js`, `.jest/{globalSetup,setupFile}.js`, `jest.config.js`
- **Infrastructure & Deployment:** `Dockerfile{,-dev,-test}`, `.dockerignore`,
  `deployment{,-alpha,-beta,-main,-next}/{base,overlays/{development,test,prod}}/**` (Kustomize),
  `.github/workflows/**` (6 CI/CD pipelines), `.husky/{commit-msg,pre-commit}`
- **Project Configuration & Tooling:** `package.json`, `next.config.js`, `jsconfig.json`,
  `.env.{development,production,test}`, `.eslintignore`, `.prettierignore`, `.prettierrc.json`,
  `.releaserc.json`, `.lintstagedrc.js`, `commitlint.config.js`, `scripts/codeshift.js`
- **Documentation & API Specs:** `README.md`, `CHANGELOG.md`, `doc/web-map-api.yaml`, `doc/web-map-router.yaml`,
  `doc/examples/**` (fixture JSON per entity type), `.github/ISSUE_TEMPLATE/**`, `.github/pull_request_template.md`

## Complexity Hotspots

Approach these areas carefully — they carry the most logic or the largest surface (31 files rated complex):

- **`src/models/MapModel.js`** (complex) — core Leaflet wrapper: marker/viewport tracking plus a UTF-grid
  pixel-scan + distance-fallback algorithm for the directional "nearest tree" arrow.
- **`src/models/utils.js`** (complex) — shared string/date/URL formatting, font loading, and dot-path
  object helpers used throughout the app; touched by many features.
- **`src/pages/_app.js`** (complex) — the entry point; wires every provider and the responsive layout switch.
- **`src/pages/trees/[treeid].js`, `planters/[planterid].js`, `organizations/[organizationid].js`,
  `wallets/[walletid].js`, `tokens/[tokenid].js`, `v2/captures/[captureid].js`, `top.js`** (complex) — the
  large dynamic detail/leaderboard pages (500-800+ lines each); most business logic lives here.
- **`src/pages/admin/theme.js`, `admin/index.js`** (complex) — admin theme playground (live iframe preview
  + palette/typography/font controls) and a Keycloak entitlement/JWT-decoding auth flow.
- **`src/context/themeContext.js`** (complex) — builds the full MUI theme (palette, typography, breakpoints,
  component overrides) for light/dark mode with live-preview event handling.
- **`src/components/{Drawer,TreeInfoDialog,Timeline,LeaderBoard,GlobalMapLayout,LayoutEmbed}.js`** (complex) —
  swipeable touch-gesture drawer, full-screen tree detail dialog, date-range filter widget, ranked leaderboard,
  map-location form, and the embed-mode layout.
- **`src/components/playground/TypographyInput.js`** (complex) — largest theme-playground form module
  (dynamic Google Font loading + font-weight selection).
- **`cypress/tests/e2e/massaging.cy.js`** (complex) — largest E2E spec (464 lines), intercepts the
  messaging/survey API.
- **`doc/web-map-api.yaml`** (complex) — the OpenAPI contract (1105 lines); large but authoritative.
- **`src/components/App.js`, `DrawerDeprecated.js`** (complex, legacy) — superseded components still in
  the tree; avoid extending, prefer their current replacements.

---

_Regenerate with `/understand` then `/understand-domain` then `/understand-onboard`._
