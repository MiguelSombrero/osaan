# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Osaan** is a knowledge management system built on a microservice landscape. It enables project managers to find employees with specific skill sets — users can create competence profiles and subscribe to be notified via email when matching profiles are added. This is a hobby/study project, not production-ready.

Deeper reference docs live in `docs/`: `architecture.md` (system landscape), `develop.md` (local test data + TODO list), `devops.md` (CI/CD, K8s platform), `tests.md` (full testing guide).

## Build & Run Commands

### Microservices (Maven, Java 25, Spring Boot 4.0.5)

```bash
# Build a service
cd microservices/<service-name>
mvn clean package

# Run with local profile (auto-starts dependencies via compose.yaml)
mvn spring-boot:run -Dspring.profiles.active=local

# Run all tests for a service
mvn test

# Run a single test class / single method
mvn test -Dtest=SkillControllerTest
mvn test -Dtest=SkillControllerTest#getSkill_returnsSkill
```

Integration tests are named `*IT.java` and start a real PostgreSQL via Testcontainers — no manual setup.

When running locally in IDE, start `competence-matching-service` first — its `compose.yaml` contains shared infrastructure (PostgreSQL, RabbitMQ, etc.).

### Admin UI (`ui/osaan-admin-ui/`)

```bash
# Run frontend with MSW mock backend (http://localhost:5173)
cd ui/osaan-admin-ui/frontend && npm run dev:mock

# Run both frontend + Express backend together
cd ui/osaan-admin-ui && npm run dev

# Regenerate OpenAPI client (don't hand-edit generated files)
cd ui/osaan-admin-ui/frontend && npm run generate:client

# Run tests
cd ui/osaan-admin-ui/frontend && npm test

# Lint (zero-warning policy) and format
cd ui/osaan-admin-ui/frontend && npm run lint
cd ui/osaan-admin-ui/frontend && npm run format
```

### User UI (`ui/osaan-ui/`)

```bash
cd ui/osaan-ui
npm run dev          # http://localhost:3000
npm run type-check   # TypeScript check
npm run lint
npm test             # Vitest
npm run build
```

### Full Stack

Prefer the `Makefile` targets — they build the service JARs first, which `docker compose` alone does not:

```bash
make build-services   # mvn clean package -DskipTests for all 5 modules
make up               # build-services + docker compose up -d --build
make up-no-build      # compose up with existing JARs/images
make down             # compose down
make clean            # compose down -v (drops volumes)
make restart          # down + up

make setup-cluster    # ./setup-cluster.sh — k3d + Istio + ArgoCD + Keycloak
make delete-cluster   # k3d cluster delete osaan-dev
```

### E2E Tests (`e2e/`)

Playwright. There is **no `npm test` script** — invoke Playwright directly, or run in-cluster via Testkube.

```bash
# Smoke tests locally (no browser launched — just gateway reachability)
cd e2e
export SMOKE_GW_HTTP=http://localhost:9080
export SMOKE_GW_HTTPS=https://localhost:9443
npx playwright test --config playwright.smoke.config.ts

# In-cluster (Testkube)
testkube run testworkflow cluster-smoke --watch
testkube run testworkflow osaan-ui-e2e --watch
```

Config picks `.env.dev` when `NODE_ENV=development`, otherwise `.env.local`.

## Architecture

### Microservices

Five services communicate via REST and RabbitMQ domain events:

- **osaan-core** — shared library: security, OAuth2, AOP (not a deployable service)
- **employee-service** — employee data management
- **skill-catalog-service** — skill library
- **competence-profile-service** — employee competence profiles
- **competence-matching-service** — subscription matching and email notifications

**Pattern: DDD + Hexagonal (ports and adapters)**

Base package: `com.github.miguelsombrero.osaan.<service_snake_case>`

Layer structure per service:

- `api/` — REST controllers, request/response DTOs (records), API mappers
- `application/` — port interfaces, application services
- `domain/` — entities, value objects, domain repository interfaces
- `infrastructure/` — driven adapters (`persistence/`, `cache/`, `client/`, `config/`)

**Refactoring policy** (same rule in `.cursor/rules/project-context.mdc` — keep the two in sync): do **not** restructure package layout, routing structure, or architecture without asking first. The one standing exception: when you are already editing a microservice for another reason, moving the classes you touch toward the layout above is fine. Wholesale re-layout of a service is a separate, explicitly-requested task.

Java conventions:

- Constructor injection only — Lombok `@RequiredArgsConstructor`, `private final` fields
- Do **not** use `var`; use explicit types
- Business logic in domain layer, not controllers or infrastructure adapters
- One class per file

### Admin UI (`ui/osaan-admin-ui/`)

React + TypeScript SPA (Vite) with a Node/Express backend proxy.

- Route-level screens in `src/pages/`; domain areas under `src/<domain>/`; shared UI in `src/components/`
- OpenAPI-generated HTTP clients in `src/api/generated/` — regenerate via `npm run generate:client`, never hand-edit
- TanStack Query for server state; Zustand for UI state
- MUI + Emotion for components; theme in `src/theme.ts`
- i18next for all UI text (`src/i18n.ts`)
- MSW for mocking API in development (`npm run dev:mock`)
- Vitest + Testing Library for unit tests; MSW handlers in `src/test/`

### User UI (`ui/osaan-ui/`)

Next.js 15 App Router with React 19.

- Routes under `src/app/` (`page.tsx`, `layout.tsx`, nested); API route handlers under `src/app/api/` proxy to microservices
- Auth: NextAuth 4 with Keycloak OAuth2 — `src/lib/auth.ts`, `src/middleware.ts`, `src/types/next-auth.d.ts`
- Shared components in `src/components/`; hooks in `src/hooks/`
- TanStack Query wired via `src/providers/query-provider.tsx`
- Tailwind CSS for styling; i18next for text
- Server Components by default; mark client components with `'use client'`
- Validation: Zod schemas in `src/lib/validation/schemas/` (one file per domain type), used by both API route handlers and forms (`react-hook-form` + `@hookform/resolvers`). Zod issues are translated to user-facing text by `src/lib/validation/i18n-error-map.ts`, which resolves i18n keys in order: `validation.fields.<field>.<code>` → `validation.custom.<message>` → `validation.codes.<code>` → `validation.generic`. Add matching keys to `public/locales/{en,fi}.json`.

### Platform

- **Auth**: Keycloak 26.4 (OAuth2)
- **Messaging**: RabbitMQ 4 via Spring Cloud Stream
- **Database**: PostgreSQL 18
- **Service mesh**: Istio (Kubernetes only)
- **GitOps**: ArgoCD watching the `dev` branch. `.github/workflows/build.yml` runs on push to `dev`, detects which components changed (per-service, admin backend/frontend, osaan-ui), builds and publishes only those images, then commits updated `kustomization.yaml` image tags — which ArgoCD picks up.
- **Observability**: Zipkin (local tracing), Jaeger (K8s), Prometheus + Grafana, Kiali
- **Secrets**: SOPS with age encryption for Kubernetes secrets

## Testing

Write tests alongside every feature implementation. Tests are not optional — skip only for the exceptions listed below.

### Java microservices

Follow the patterns established in `skill-catalog-service` (the most fully tested service).

| Layer | Test type | Tools | Canonical example |
|---|---|---|---|
| Domain entity / value object | Pure unit test | JUnit 5 + AssertJ | `SkillTest`, `SkillNameTest` |
| Service | Unit test with mocks | JUnit 5 + Mockito | `CompetenceServiceTest`, `ManageSkillsServiceTest` |
| Controller | MockMvc unit test | Spring MVC Test + Mockito | `SkillControllerTest`, `AdminSkillControllerTest` |
| Repository (custom queries) | Testcontainers integration test | `@Testcontainers` + `@ServiceConnection` | `CompetenceRepositoryIT` |

**What to test:**
- Business logic in domain entities and services
- Every controller endpoint: happy path + 400/404/403 error cases
- Custom repository query methods (not Spring Data auto-generated ones)
- Security / role requirements on endpoints

**What to skip:**
- Auto-generated Spring Data CRUD methods
- Application context load tests
- Trivial getters/setters/mappers with no logic

**Patterns:**
- `@ExtendWith(MockitoExtension.class)` + `@InjectMocks` / `@Mock` for service and controller unit tests
- `MockMvcBuilders.standaloneSetup(controller)` — no need to load full Spring context
- `ArgumentCaptor` to assert on what was passed to mocked collaborators
- Share Testcontainers configuration via `@Import(TestcontainersConfiguration.class)`

### Admin UI (`ui/osaan-admin-ui/frontend`)

Infrastructure is already in place. Follow the patterns in `src/skill/components/__tests__/` and `src/skill/hooks/__tests__/`.

- Render all components with `renderWithProviders()` from `src/test/utils/renderWithProviders.tsx`
- Control API responses via `setMock*()` helpers and `server.use()` overrides from `src/test/mocks/`
- Test: rendering, user interactions, error states, loading states, role-based visibility
- Use `@testing-library/user-event` (not `fireEvent`) for interactions

### User UI (`ui/osaan-ui`)

Infrastructure is in place (Vitest + Testing Library + MSW). Test files live in `src/**/__tests__/`.

- **Custom hooks** — test with `renderHook` + a real `QueryClient` (no retries, no cache time)
- **Client components** (`'use client'`) — test with `renderWithProviders()` from `src/test/renderWithProviders.tsx`
- **Pure utility functions** — plain unit tests
- **Zod schemas** — plain unit tests per schema, alongside `src/lib/validation/__tests__/`
- Mock HTTP calls with MSW handlers in `src/test/mocks/handlers.ts`; add new route handlers for new API endpoints
- **Skip**: Server Components, NextAuth internals

**API route handlers** (`src/app/api/**/route.ts`) — test these. They own request validation, so their tests are where validation behaviour is pinned down. Follow `src/app/api/skills/__tests__/route.test.ts`.

- Import the handler directly (`import { GET } from '../route'`) and call it — no HTTP server, no MSW
- Stub the upstream call with `vi.mock('@/lib/server-api', () => ({ fetchWithAuth: vi.fn() }))`; `vi.mocked(fetchWithAuth).mockReset()` in `beforeEach`
- Build the request by hand with `new NextRequest(url, { method, body })`
- Dynamic segments are passed as the second arg with **async params**: `{ params: Promise.resolve({ employeeId: 'e1' }) }`
- Cover per endpoint: valid input forwards upstream with the expected path/method (`expect.objectContaining`), and each invalid input returns 400 **and** leaves `fetchWithAuth` uncalled

Run: `cd ui/osaan-ui && npm test`

## Local Test Data

Seeded users for local development — **username is also the password**. Full skill matrix in `docs/develop.md`.

| Username | Role |
|---|---|
| `anna` | ADMIN |
| `mikko` | MANAGER, USER |
| `liisa`, `jari`, `sari`, `aleksi`, `kaisa`, `timo`, `emilia`, `petri` | USER |

`Java` appears on 7 of the 10 profiles with ratings 1–5, which makes it the most useful skill for exercising search and filter scenarios.

### Local service URLs (Docker Compose)

| Service             | URL                                  |
| ------------------- | ------------------------------------ |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |
| Mailhog (SMTP UI)   | http://localhost:8025                |
| Zipkin              | http://localhost:9411                |
| Prometheus          | http://localhost:9090                |
