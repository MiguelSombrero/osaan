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

### Local service URLs (Docker Compose)

| Service             | URL                                  |
| ------------------- | ------------------------------------ |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |
| Mailhog (SMTP UI)   | http://localhost:8025                |
| Zipkin              | http://localhost:9411                |
| Prometheus          | http://localhost:9090                |
