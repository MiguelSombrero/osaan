# Task 04: employee-service tests to the skill-catalog-service pattern

- **Status:** needs-refinement
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-4

## Why

employee-service has one test, a context-load test. Its three endpoints
(`POST /v1/employees`, `GET /v1/employees?employeeIds=`,
`GET /v1/employees/{keycloakId}`), the `USER` role rule on them, the
application service and the JPA repository adapter are untested. The
domain `Employee` is a bare record, so nothing validates a name or email,
and `POST` has no request validation. It is the only service on Spring Data
JPA; the others use Spring Data JDBC.

## Scope

- Tests on the layers of the skill-catalog-service pattern, as listed in
  `microservices/CLAUDE.md`:
  - request validation: Bean Validation on the request DTOs, so invalid
    input gets 400 instead of being stored
  - domain: a test only where the domain holds a rule
  - service: `ManageEmployeesService`, with mocks
  - controller: each endpoint with MockMvc, happy path plus 400, 404 and
    403
  - security: the role rule on `/v1/employees/**`, and that actuator and
    API docs stay open
  - repository: an `*IT` with Testcontainers for the adapter's queries
    and the JPA mapping
- A bug the new tests find is fixed in this task when it is small, and
  becomes a task otherwise.

## Constraints

- **Validation (binds tasks 04 and 05):** invalid input is rejected with
  Bean Validation on the request DTOs, as competence-matching-service
  already does. Domain records stay plain; no value objects are introduced
  for validation. A domain test is written only where the domain holds a
  rule. Decided by the PO at refinement.
- The package layout stays as it is; employee-service already follows the
  hexagonal layout.
- Spring Data JPA stays; moving to JDBC is not modernization.

## Open questions

**None.**

## Acceptance criteria

- [ ] `make verify COMPONENTS=employee-service` runs a test class for each
      layer listed in Scope, and they pass
- [ ] Every endpoint in `EmployeeController` has a passing test for its
      happy path and each error status it can return
- [ ] Removing the `hasRole("USER")` rule makes a test fail
- [ ] `POST /v1/employees` with a blank name or an invalid email returns
      400 in a controller test (today it is stored)
