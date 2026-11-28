# Iteration 1 — Backend

Goal: the microservices build as one Maven project on current Spring, run
from smaller images, and every service is tested to skill-catalog-service's
level.

## Done when

Written at refinement.

## Tasks

Planned, one line each. Task files are written when this iteration is
refined.

1. **One Maven build.** Root aggregator `pom.xml` (reactor) with a shared
   parent for versions, so `osaan-core` builds with the services and local
   builds stop depending on GitHub Packages. Maven Wrapper at the root.
2. **Spring Boot 4.1 → 4.2, Spring Cloud 2025.1 → 2026.0**, springdoc 3.0 →
   3.2 and the rest of the Java dependencies, via `upgrade-component`.
3. **Container images.** JRE base instead of JDK, layered jar or Spring
   Boot's own image build, non-root user — whichever is current practice,
   decided at refinement.
4. **employee-service tests** from 1 to the skill-catalog-service pattern:
   domain, service, controller and repository IT.
5. **competence-profile-service and competence-matching-service tests**
   filled in to the same pattern, including the RabbitMQ event flow between
   them, tested with Testcontainers.
6. **Service configuration cleanup** (old TODO "make microservices
   configuration better"): one way to configure per environment, no
   duplicated profile files.
7. **Services export their OpenAPI spec.** Each service writes its springdoc
   spec into the repository at build time, and `make verify` fails when the
   committed spec no longer matches the code. The UIs generate their clients
   from these files instead of hand-copied YAML.
8. **Endpoints work with auth disabled.** With the `local` profile,
   `GET /v1/competences` and `GET /v1/subscriptions` return 500 because they
   read the user from a token that is not there (found in iteration 0 task
   05).
