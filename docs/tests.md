# Testing

## Microservices (Java / Spring Boot)

`skill-catalog-service` is the reference service — it has the most complete test suite. Follow its patterns when adding tests to other services.

| Layer | Type | Tools | Examples |
|---|---|---|---|
| Domain entity / value object | Unit | JUnit 5, AssertJ | `SkillTest`, `SkillNameTest` |
| Application service | Unit + mocks | JUnit 5, Mockito | `ManageSkillsServiceTest` |
| Controller | MockMvc unit | Spring MVC Test, Mockito | `SkillControllerTest`, `AdminSkillControllerTest` |
| Security | MockMvc unit | Spring Security Test | `SecurityConfigTest` |
| Repository (custom queries) | Integration | Testcontainers + `@ServiceConnection` | `CachingSkillRepositoryIntegrationIT` |

```bash
# Run all tests for a service
cd microservices/<service-name>
mvn test

# Run a single test
mvn test -Dtest=SkillControllerTest

# Run a single method
mvn test -Dtest=SkillControllerTest#getSkill_returnsSkill
```

Integration tests (`*IT.java`) spin up a real PostgreSQL container via Testcontainers — no manual setup required.

---

## Admin UI (`ui/osaan-admin-ui/frontend`)

Vitest + Testing Library. Test files live next to the code in `__tests__/` directories.

```bash
cd ui/osaan-admin-ui/frontend
npm test           # run once
npm test -- --watch  # watch mode
```

Use `renderWithProviders()` from `src/test/utils/` to render components with all required providers. Control API responses via MSW handlers in `src/test/mocks/`.

---

## User UI (`ui/osaan-ui`)

Vitest + Testing Library. Test files in `src/**/__tests__/`.

```bash
cd ui/osaan-ui
npm test
```

Custom hooks: `renderHook` with a real `QueryClient` (no retries, no cache time). Client components: `renderWithProviders()` from `src/test/`. MSW mocks in `src/test/mocks/handlers.ts`.

---

## E2E & Smoke Tests (Playwright + Testkube)

Tests live in `e2e/` and run inside the k3d cluster via Testkube.

| Workflow | What it tests | Trigger |
|---|---|---|
| `osaan-ui-e2e` | Full E2E: Keycloak login, skill list | Any deployment change in `osaan-dev` |
| `cluster-smoke` | HTTP reachability of all 10 cluster endpoints | Any deployment change in `osaan-dev`, `istio-system`, or `keycloak` |

### Run manually

```bash
# Smoke tests (all 10 gateway endpoints)
testkube run testworkflow cluster-smoke --watch

# Full E2E
testkube run testworkflow osaan-ui-e2e --watch

# View results
testkube get testworkflowexecution --testworkflow cluster-smoke
```

### Run locally (smoke tests only)

```bash
cd e2e
export SMOKE_GW_HTTP=http://localhost:9080
export SMOKE_GW_HTTPS=https://localhost:9443
npx playwright test --config playwright.smoke.config.ts
```

In-cluster runs route through the Istio ingressgateway service DNS name with `Host` headers — no browser is launched, so smoke tests are lightweight (~256 Mi). Full E2E uses Chromium, Firefox, and WebKit and requires ~2 Gi.
