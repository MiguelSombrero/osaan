# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Osaan** is a knowledge management system built on a microservice landscape. It enables project managers to find employees with specific skill sets — users can create competence profiles and subscribe to be notified via email when matching profiles are added. This is a hobby/study project, not production-ready.

## Build & Run Commands

### Microservices (Maven, Java 25, Spring Boot 4.0.5)

```bash
# Build a service
cd microservices/<service-name>
mvn clean package

# Run with local profile (auto-starts dependencies via compose.yaml)
mvn spring-boot:run -Dspring.profiles.active=local

# Run a single test
mvn test -Dtest=MyTestClass#myTestMethod
```

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
```

### User UI (`ui/osaan-ui/`)

```bash
cd ui/osaan-ui
npm run dev          # http://localhost:3000
npm run type-check   # TypeScript check
npm run build
```

### Full Stack

```bash
# Docker Compose (requires pre-built microservice JARs)
docker compose up -d --build

# Kubernetes (k3d) — sets up full platform including Istio, ArgoCD, Keycloak
./setup-cluster.sh
```

### E2E Tests

```bash
cd e2e && npm test
```

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

If the microservice does not follow this package structure yet, feel free to refactor to this direction.

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

### Platform

- **Auth**: Keycloak 26.4 (OAuth2)
- **Messaging**: RabbitMQ 4 via Spring Cloud Stream
- **Database**: PostgreSQL 18
- **Service mesh**: Istio (Kubernetes only)
- **GitOps**: ArgoCD watching the `dev` branch; CI updates `kustomization.yaml` image tags on push
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
- Mock HTTP calls with MSW handlers in `src/test/mocks/handlers.ts`; add new route handlers for new API endpoints
- **Skip**: Server Components, Next.js API route handlers, NextAuth internals

Run: `cd ui/osaan-ui && npm test`

### Local service URLs (Docker Compose)

| Service             | URL                                  |
| ------------------- | ------------------------------------ |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |
| Mailhog (SMTP UI)   | http://localhost:8025                |
| Zipkin              | http://localhost:9411                |
| Prometheus          | http://localhost:9090                |
