# Task 03: Smaller, non-root service images

- **Status:** refined
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-3

## Why

All four service Dockerfiles are the same four lines: a full JDK image
(`eclipse-temurin:25-jdk-alpine-3.22`), the fat jar copied in as one layer,
run as root. A local employee-service image is 551 MB, every code change
re-ships every dependency, and nothing in the container drops root.
CI builds the jar outside Docker and pushes `linux/amd64` and `linux/arm64`
images; `make cluster-verify` builds the same Dockerfile locally.

## Scope

- Each service image starts from a JRE, not a JDK, runs as a non-root user,
  and splits the application into layers so a code change rebuilds only the
  application layer.
- One image definition serves all four services, instead of four copies.
- CI (`Build & Publish`) and `make cluster-verify` build the images the new
  way, and CI still pushes both architectures.
- The Helm chart's pod security context matches the image's non-root user.

## Constraints

- One shared multi-stage Dockerfile: the jar that CI or
  `make cluster-verify` already builds is extracted into Spring Boot's
  layers (`-Djarmode=tools … extract --layers`) onto an Eclipse Temurin 25
  JRE base, and runs as a non-root user. Not Cloud Native Buildpacks, not
  Jib. Decided by the PO at refinement.
- No JVM AOT cache (JEP 483) for now: its training run would start each
  service against a database at image build time. Decided by the PO at
  refinement.
- The base image version is read from the registry, not memory, through
  `upgrade-component`.

## Open questions

**None.**

## Acceptance criteria

- [ ] `docker image inspect` of a freshly built employee-service image
      shows a size under 551 MB and a non-root `User`
- [ ] `docker run --rm --entrypoint id <image>` does not print `uid=0`
- [ ] A test in `scripts/*.test.mjs` (`make verify`) fails if a service
      image definition uses a JDK base or no non-root user
- [ ] `make cluster-verify` passes for all four services with the new
      images, and pods start with `runAsNonRoot: true`
