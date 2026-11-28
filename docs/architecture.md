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

The services use ports and adapters (hexagonal architecture) to separate
business logic from the framework and external systems:

```
api/            REST controllers, request/response DTOs, API mappers
application/    Port interfaces, application services
domain/         Entities, value objects, domain repository interfaces
infrastructure/ Driven adapters — persistence, cache, client, config
```

Business rules live in the domain. Application services coordinate use
cases, and controllers and infrastructure adapters handle I/O. The
competence-profile-service is still converging on this layout. See
[iteration 1 task 08](tasks/iteration-1/08-competence-profile-hexagonal.md).

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
| Keycloak 26 | OAuth2 / IAM |
| PostgreSQL 17 | Persistent storage (one database shared by the services) |
| RabbitMQ 4 | Domain event messaging (Spring Cloud Stream) |
| Redis / Valkey | Session storage |
| Istio | Service mesh (Kubernetes only) |
| Jaeger | Distributed tracing (Kubernetes only) |
| Prometheus + Grafana | Metrics and monitoring (Kubernetes only) |

## Build and deployment

The [Verify workflow](../.github/workflows/verify.yml) runs the same checks
as `make verify` on PRs to `dev`. On push to `dev`, the
[build workflow](../.github/workflows/build.yml) detects changed components
and builds and pushes the affected service and UI images to Docker Hub.
Java services and UI frontends run their tests before publication. Images
target amd64 and arm64 and carry `latest` and commit SHA tags. Publication
uses `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.

The [bootstrap script](../setup-cluster.sh) sets up OLM, namespaces and
secrets, bootstraps Istio with Helm, installs the platform operators,
ArgoCD, Image Updater, External Secrets and Testkube, and applies the
[root ArgoCD application](../argocd/app-of-apps.yaml). Setup commands and
credentials are in the [root README](../README.md#kubernetes).

The root application watches [manifests/argocd-apps](../manifests/argocd-apps/)
on `dev` with auto-sync, prune and self-heal. Sync waves put Istio CRDs
first (−2), then the control plane and gateway (−1), followed by the
platform, gateways, Valkey and observability (0), and the UI and
microservice ApplicationSets and Testkube workflows (1). The Istiod
application's Helm values carry mesh logging, tracing and sampling
configuration. Versions are pinned in the application manifests and
the bootstrap script.

When configured, Image Updater polls Docker Hub and writes image digests
back to `dev`. Bootstrap creates `argocd-image-updater-dockerhub` for
authenticated polling and `argocd-image-updater-secret` for GitHub
write-back in the `argocd` namespace when their credentials are supplied.

---

## Key decisions

**One Maven reactor for the backend.** The shared parent manages Java
dependencies and test plugins. Each service builds with the `osaan-core`
sources from the same checkout, which removes the separate library
publication and GitHub Packages credentials from the build.

**k3d is the only full-stack runtime.** `docker-compose.yaml` runs only the
shared infrastructure that IDE and `npm run dev` work needs, at the versions
the k3d files declare, which `scripts/check-compose-versions.mjs` enforces.
A second full deployment in Compose had drifted from k3d and doubled
upgrade work, so it was removed.

**Hexagonal services.** Ports keep domain logic independent of Spring,
database, HTTP and messaging adapters. A conventional layered design with
the business logic calling framework and persistence types directly was
rejected because those dependencies make rules harder to test in isolation.

**A backend for each frontend.** The admin UI uses an Express proxy, and
the user UI uses Next.js route handlers. Both handle user sessions and
present APIs shaped for their own UI. Direct browser calls to every service
were rejected because they would expose each service to the browser and
spread token handling and CORS configuration across the stack.

**RabbitMQ for domain events.** Spring Cloud Stream publishes events such
as skill creation so interested services can react independently of the
request that changed the data. Synchronous REST callbacks were rejected for
these notifications because they would couple the publisher's success to
every consumer's availability.

**GitOps with ArgoCD.** The cluster reconciles applications and image
digests declared in Git. Direct deployments from CI were rejected because
CI would need cluster credentials and live changes could drift from the
repository without reconciliation.

**SOPS and age for secrets.** The dev bootstrap decrypts Kubernetes secrets
using the environment's age key, and Git records the encrypted manifests.
Plaintext secrets in Git were rejected because everyone with repository
access could read them.

**Istio for the k3d mesh.** Istio supplies host-based ingress, TLS routing
and service telemetry using a shared configuration. A standalone ingress
controller was rejected because mesh traffic policy and service-level
tracing would then require separate mechanisms.
