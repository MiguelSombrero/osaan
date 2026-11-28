# Task 01: One Maven build for the microservices

- **Status:** done
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-1

## Why

The five Maven projects under `microservices/` build one by one. Each
service resolves `osaan-core` from GitHub Packages, which needs a token
locally, so `make verify` and `make cluster-verify` work around it by
installing `osaan-core` first. Every service repeats the same versions
(Spring Cloud, springdoc, MapStruct, datasource-micrometer), plugin setup and
repository list, and they have already drifted: only skill-catalog-service
declares the Failsafe plugin, so `CompetenceRepositoryIT` in
competence-profile-service has never run. competence-matching-service's
artifact is still called `subscription-matching-service`.

## Scope

- One aggregator (reactor) POM lists `osaan-core` and the four services,
  and one parent POM holds the shared versions, dependency management,
  plugin setup and the Failsafe plugin. Each service POM keeps only what is
  its own.
- All modules share one project version.
- A Maven Wrapper pins the Maven version, and every Maven call in the
  repository goes through it: `make build-services`, `scripts/verify.mjs`,
  `scripts/cluster-verify.mjs`, the `Verify` and `Build & Publish`
  workflows.
- `osaan-core` is built in the reactor and no longer resolved from or
  published to GitHub Packages; the `github` and Spring repository entries
  are removed.
- competence-matching-service's artifactId matches its directory name.
- `*IT` classes run in every module's `verify`.
- `scripts/verify.mjs` keeps one component per service, each built with
  `-pl <service> -am`, so a pull request still verifies only what it
  touched and CI keeps one job per service.
- The microservices `CLAUDE.md` and README show the new commands.

## Constraints

- The aggregator and shared parent are one file,
  `microservices/pom.xml`, with the Maven Wrapper beside it; Maven commands
  run as `(cd microservices && ./mvnw …)`. The repository root holds no
  Maven files. Decided by the PO at refinement.
- Starts after [iteration 0](../iteration-0.md) tasks 05 and 06 are merged:
  both edit `scripts/verify.mjs`, the Makefile and the microservice
  READMEs, and 06 merges those READMEs into `microservices/README.md`.
  Decided by the PO at refinement; binds every iteration 1 task.
- Maven 3.x: Maven 4.0 is still a release candidate.
- Versions do not change in this task, except that the services now share
  one; upgrades are [task 02](02-spring-upgrade.md).

## Open questions

**None.**

## Acceptance criteria

- [x] With a fresh local Maven repository and no `settings.xml` server for
      GitHub, `(cd microservices && ./mvnw verify)` builds all five modules
      and runs their tests
- [x] `CompetenceRepositoryIT` runs and passes in `make verify
      COMPONENTS=competence-profile-service` (it does not run today)
- [x] `make verify`, `make build-services` and `make cluster-verify
      COMPONENTS=employee-service` pass
- [x] `git grep -n 'maven[.]pkg[.]github[.]com'` finds nothing
