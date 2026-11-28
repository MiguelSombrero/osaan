# Task 05: Docker Compose runs shared infrastructure only

- **Status:** done
- **Iteration:** [0](../iteration-0.md)
- **Covers:** DW-5

## Why

The root `docker-compose.yaml` is a second full deployment of the stack, and
it has already drifted from k3d: Keycloak 26.4 instead of 26.6, Mailhog,
Zipkin 2.24 and unpinned `latest` images. Keeping two full runtimes means
every upgrade is done twice. Agreed in planning: k3d is the only full-stack
runtime, and Compose runs only what IDE and `npm run dev` work needs.

## Scope

- The root `docker-compose.yaml` runs shared infrastructure only:
  PostgreSQL, RabbitMQ, Keycloak with the realm import, Valkey and a mail
  catcher. Every image is pinned to the version k3d runs.
- The application services, Prometheus, Grafana and Zipkin are removed from
  Compose. Observability is used in k3d.
- Each microservice's own `compose.yaml` either points at the shared file
  or is removed, so the infrastructure is defined once.
- The make targets and README for local development match.

## Constraints

- k3d versions are the source of truth. When iteration 4 upgrades a
  component, its Compose pin moves in the same task.
- The mail catcher stays Mailhog here, because k3d runs Mailhog. Both move to
  Mailpit together in [iteration 4](../iteration-4.md) task 10.
- The version check is a Node `.mjs` script ([task 01](01-agent-workflow.md)).
- CI has no cluster, so the check compares Compose with the versions the
  k3d files declare, with no second version list. RabbitMQ, Valkey,
  PostgreSQL and Mailhog get exact versions there, keeping what already
  runs. A pinned image no longer moves with its operator or chart. The PO,
  asked on 2026-11-28 during implementation: "Yes, pin all".

## Open questions

**None.**

## Acceptance criteria

- [x] `docker compose config` lists only infrastructure services, each with
      a pinned image tag
- [x] A check in `make verify` fails when a Compose image tag differs from
      the one deployed in k3d for the same component
- [x] With Compose up, each microservice starts with the `local` profile
      and `/actuator/health` returns `UP`
