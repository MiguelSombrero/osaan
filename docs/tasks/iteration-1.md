# Iteration 1 — Backend

Goal: the microservices build as one Maven project on current Spring, run
from smaller images, and every service is tested to skill-catalog-service's
level.

## Done when

- **DW-1:** From a clean clone with no GitHub Packages credentials, one
  Maven Wrapper command builds `osaan-core` and the four services and runs
  every unit and integration test, `*IT` classes included.
- **DW-2:** Every service runs Spring Boot 4.2 and Spring Cloud 2026.0, and
  `make verify` and `make cluster-verify` pass on them.
- **DW-3:** Service images start from a JRE base, run as a non-root user and
  are smaller than today's 551 MB.
- **DW-4:** employee-service, competence-profile-service and
  competence-matching-service have domain, service, controller and
  repository tests on the skill-catalog-service pattern, and the
  `SkillCreatedEvent` flow is tested against a real RabbitMQ.
- **DW-5:** Each service is configured one way per environment, with no
  setting repeated across profile files.
- **DW-6:** Each service's OpenAPI spec is committed, `make verify` fails
  when it no longer matches the code, and the admin UI generates its client
  from it.

## Tasks

| ID | Task | Status |
|---|---|---|
| [01](iteration-1/01-one-maven-build.md) | One Maven build for the microservices | refined |
| [02](iteration-1/02-spring-upgrade.md) | Spring Boot 4.2, Spring Cloud 2026.0 and the Java dependencies | refined |
| [03](iteration-1/03-container-images.md) | Smaller, non-root service images | refined |
| [04](iteration-1/04-employee-service-tests.md) | employee-service tests to the skill-catalog-service pattern | refined |
| [05](iteration-1/05-competence-services-tests.md) | competence-profile and competence-matching tests, event flow included | refined |
| [06](iteration-1/06-service-configuration.md) | One way to configure each service | refined |
| [07](iteration-1/07-openapi-export.md) | Services export their OpenAPI spec | refined |
| [08](iteration-1/08-competence-profile-hexagonal.md) | competence-profile-service to the hexagonal layout | refined |
| [09](iteration-1/09-local-auth-disabled.md) | A local run works, signed in or not | needs-refinement |

The iteration starts once [iteration 0](iteration-0.md) tasks 05 and 06
are merged. 01 goes first: every later task builds and tests through it.
02 comes next, so tests and images are written against the Spring versions
they ship with. 08 is merged before 05, and 06 before 07.
