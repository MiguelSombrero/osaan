# Osaan Architecture

## System Overview

Osaan is a knowledge management system built on a microservice landscape. Project managers can search for employees with specific skill sets. Employees maintain competence profiles; managers can subscribe to skill-set criteria and receive email notifications when a matching profile is added.

```
osaan-ui (Next.js)        osaan-admin-ui (React SPA)
        │                           │
        │ (Next.js API routes)      │ (Express proxy)
        └──────────┬────────────────┘
                   │ REST
     ┌─────────────┴──────────────────────┐
     │           Microservices            │
     │  employee-service                  │
     │  skill-catalog-service             │
     │  competence-profile-service        │
     │  competence-matching-service       │
     └───────┬──────────────┬────────────┘
             │ REST         │ RabbitMQ events
        PostgreSQL       RabbitMQ
```

Authentication flows through Keycloak (OAuth2) for all services and UIs.

---

## Microservices

Java 25, Spring Boot 4, Maven. Base package: `com.github.miguelsombrero.osaan.<service>`.

| Component | Purpose |
|-----------|---------|
| osaan-core | Shared library: security, OAuth2, AOP — not a deployable service |
| employee-service | Employee data management |
| skill-catalog-service | Skill library |
| competence-profile-service | Employee competence profiles |
| competence-matching-service | Subscription matching and email notifications |

### Pattern: DDD + Hexagonal Architecture

Each service follows ports-and-adapters (hexagonal) architecture with strict layer separation:

```
api/            REST controllers, request/response DTOs, API mappers
application/    Port interfaces, application services
domain/         Entities, value objects, domain repository interfaces
infrastructure/ Driven adapters — persistence, cache, client, config
```

Business logic lives exclusively in the domain layer. Controllers and infrastructure adapters contain no business logic.

---

## Admin UI (`ui/osaan-admin-ui/`)

For ADMIN role: manage skills and employees.

- React + TypeScript SPA (Vite) + Node/Express backend proxy
- MUI + Emotion for components; TanStack Query for server state; Zustand for UI state
- OpenAPI-generated HTTP clients — never hand-edit, regenerate with `npm run generate:client`
- i18next for all UI text; MSW for mock API in development

---

## User UI (`ui/osaan-ui/`)

For USER and MANAGER roles: browse skills and manage competence profiles.

- Next.js 15 App Router with React 19
- Server Components by default; Client Components marked with `'use client'`
- Next.js API routes proxy requests to backend microservices (avoids CORS, centralises auth)
- NextAuth 4 + Keycloak for OAuth2 authentication
- TanStack Query for client-side data fetching; Tailwind CSS for styling; i18next for text

---

## Platform Dependencies

| Dependency | Purpose |
|------------|---------|
| Keycloak 26.4 | OAuth2 / IAM |
| PostgreSQL 18 | Persistent storage (one database per service) |
| RabbitMQ 4 | Domain event messaging (Spring Cloud Stream) |
| Redis / Valkey | Session storage |
| Istio | Service mesh (Kubernetes only) |
| Zipkin / Jaeger | Distributed tracing (local / Kubernetes) |
| Prometheus + Grafana | Metrics and monitoring |

See [devops.md](devops.md) for CI/CD pipeline and Kubernetes platform setup.
