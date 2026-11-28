# Task 08: competence-profile-service to the hexagonal layout

- **Status:** needs-refinement
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-4

## Why

competence-profile-service is the only service outside the hexagonal
layout that `microservices/CLAUDE.md` describes. Its code sits in flat
`competence/` (controller, service, repository, entity and DTOs together),
`config/` and `integration/` packages, with one class already in
`infrastructure/client/`. [Task 05](05-competence-services-tests.md)
writes its missing tests, and they should be written once, against the
final layout. Nothing checks the layout in any service, so it can drift
again.

## Scope

- competence-profile-service's classes move into `api/`, `application/`
  (ports and services), `domain/` and `infrastructure/` (`persistence/`,
  `client/`, `messaging/`, `config/`), like the other three services.
  Behaviour, endpoints and the database schema do not change.
- Its existing tests move with the code and pass unchanged in what they
  assert.
- ArchUnit layer rules guard the layout in all four services.

## Constraints

- Separate from task 05, and merged before it, so the move is reviewed
  apart from the new tests. Decided by the PO at refinement.
- ArchUnit (`com.tngtech.archunit:archunit-junit5`, test scope) is added
  through the shared parent from [task 01](01-one-maven-build.md). One
  rule set, kept in `osaan-core`'s test jar, is run by every service:
  `domain` depends on no other layer, `application` not on `api` or
  `infrastructure`, and `api` not on `infrastructure`. Decided by the PO
  at refinement.
- A service that breaks a rule today is fixed in this task if the fix is a
  class move; otherwise the finding becomes a task.

## Open questions

**None.**

## Acceptance criteria

- [ ] The ArchUnit test fails on today's competence-profile-service and
      passes after the move, in `make verify
      COMPONENTS=competence-profile-service`
- [ ] The same ArchUnit test runs and passes in `make verify` for the other
      three services
- [ ] Every test that passed before the move still passes, and
      `make cluster-verify COMPONENTS=competence-profile-service` passes
