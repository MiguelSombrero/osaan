# Task 06: One way to configure each service

- **Status:** refined
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-5

## Why

The old TODO "make microservices configuration better". Each service has
three configuration files, and each environment reaches them a different
way:

- `application.yaml` reads environment variables with placeholders; k3d
  sets them from the chart's ConfigMap and Secrets, with no profile.
- `application-local.yaml` (IDE runs) sets ports, log levels and Mailhog
  and RabbitMQ on `localhost`, and sets properties named like environment
  variables (`APP_AUTH_DISABLED: true`) so the placeholders pick them up.
- `application-docker.yaml` served the Compose deployment of the apps,
  which [iteration 0 task 05](../iteration-0/05-compose-infra-only.md)
  removes, and hard-codes a database password.

The four `application.yaml` files repeat the same management, Hikari,
logging, springdoc and OpenAPI-info blocks. competence-matching-service's
local management port is 4003 while its default is 4004. The OpenAPI
license URL in every service carries a `?token=` query parameter copied
from a GitHub raw link.

## Scope

- Each service has one way to set a value per environment, and the same
  property names in every environment.
- Settings shared by all services are defined once.
- `application-docker.yaml` is removed, and with it every password in a
  committed configuration file.
- The `?token=` is removed from the license URL.
- The chart's ConfigMap values follow any renamed property, without
  restructuring the chart.
- The microservices README says how to run a service locally.

## Constraints

- Starts after [iteration 0 task 05](../iteration-0/05-compose-infra-only.md)
  is merged: it changes the `local` profile and the Compose files this task
  builds on.
- Restructuring the charts and their values is
  [iteration 4](../iteration-4.md) task 1.
- **One way:** `application.yaml` holds every property, with
  environment-variable placeholders whose defaults suit k3d; k3d keeps
  setting environment variables from the chart. One `local` profile
  overrides only what an IDE run against Compose needs (localhost hosts,
  ports, auth off), using real property names, not names shaped like
  environment variables. No env-file mechanism. Decided by the PO at
  refinement.
- **Shared settings** live in one configuration file in `osaan-core`
  (for example `osaan-defaults.yaml`) that each service imports with
  `spring.config.import`; a service overrides a value only where it
  differs. Decided by the PO at refinement.

## Open questions

**None.**

## Acceptance criteria

- [ ] `find microservices -name 'application-docker.yaml'` finds nothing,
      and `grep -rn "password: " microservices/*/src/main/resources` finds
      no literal password
- [ ] A test per service (`make verify`) loads its configuration the way
      k3d does and asserts the resolved values of datasource, issuer,
      management port and tracing endpoint
- [ ] With Compose up, each service starts locally the documented way and
      `/actuator/health` returns `UP`
- [ ] `make cluster-verify` passes for all four services
