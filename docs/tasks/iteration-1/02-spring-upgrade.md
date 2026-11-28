# Task 02: Spring Boot 4.2, Spring Cloud 2026.0 and the Java dependencies

- **Status:** refined
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-2

## Why

The services run Spring Boot 4.1.0 and Spring Cloud 2025.1.2. Maven Central
has Spring Boot 4.2.0, Spring Cloud 2026.0.0 and springdoc 3.2.1, and
datasource-micrometer has moved from 2.2.1 to 2.3.1. Upgrading now, before
the new tests and images, means tasks 03–07 are written once, against the
versions they ship with. `spring.cloud.refresh.enabled: false` is still set
in every service as a workaround for a Spring Boot 4.0.0-SNAPSHOT problem,
and Testcontainers starts `postgres:latest` while k3d runs PostgreSQL 17.

## Scope

- Spring Boot 4.1 → 4.2 and Spring Cloud 2025.1 → 2026.0 in the shared
  parent from [task 01](01-one-maven-build.md), each through
  `upgrade-component`: release notes and migration guide read for every
  version crossed.
- springdoc, datasource-micrometer and the other dependencies and plugins
  the parent pins move to their current stable release. MapStruct stays on
  1.6.x while 1.7 is a beta.
- Deprecations the new versions report at compile time and startup are
  fixed, and workarounds for problems the new versions have fixed are
  removed, starting with `spring.cloud.refresh.enabled`.
- Testcontainers images are pinned to the version k3d runs (PostgreSQL 17)
  instead of `latest`.
- Surprises are logged in `docs/common-failures.md`.

## Constraints

- The upgrade is proven by the tests that pass before it, run again after
  it, plus `make cluster-verify` for all four services.
- Tracing keeps `spring-boot-starter-zipkin`, exporting to Jaeger's Zipkin
  endpoint. The move to OpenTelemetry (OTLP) is made with the Collector
  decision in [iteration 4](../iteration-4.md) task 10, so the exporter
  changes once. Decided by the PO at refinement.

## Open questions

**None.**

## Acceptance criteria

- [ ] `./mvnw help:evaluate -Dexpression=project.parent.version` in a
      service prints `4.2.0`, and the effective POM imports Spring Cloud
      `2026.0.0`
- [ ] `make verify` passes, running every test that passed before the
      upgrade
- [ ] `make cluster-verify COMPONENTS=employee-service,skill-catalog-service,competence-profile-service,competence-matching-service`
      passes
- [ ] No Testcontainers configuration uses an image tagged `latest`
