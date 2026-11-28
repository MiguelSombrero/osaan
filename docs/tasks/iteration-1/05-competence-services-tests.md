# Task 05: competence-profile and competence-matching tests, event flow included

- **Status:** needs-refinement
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-4

## Why

The two services that carry Osaan's main flow are partly tested. When a
competence is added, competence-profile-service publishes a
`SkillCreatedEvent` (from `osaan-core`) to `skill.created.queue` through
Spring Cloud Stream; competence-matching-service consumes it, finds the
subscriptions it matches and emails each subscriber, with a dead-letter
queue for failures. Today the producer and the consumer are each tested
with mocks only, so nothing checks that what one side sends is what the
other side reads, or that a failing message reaches the DLQ.

- competence-profile-service has controller, service and repository tests,
  but its repository IT never runs ([task 01](01-one-maven-build.md)
  fixes that), and the REST client that calls employee-service and
  skill-catalog-service through a circuit breaker (`CompetenceIntegration`)
  is untested.
- competence-matching-service has controller, service, email and consumer
  unit tests, but no domain test, no repository IT for its custom delete
  query, and only a context-load test against real infrastructure.

## Scope

- Both services reach the skill-catalog-service pattern in
  `microservices/CLAUDE.md`: domain, service, controller, security and
  repository tests, with request validation as in
  [task 04](04-employee-service-tests.md).
- competence-profile-service's REST client is tested against stubbed
  employee and skill services: success, 404 and the circuit breaker's
  fallback.
- The event flow is tested against a real RabbitMQ in Testcontainers:
  - `osaan-core` keeps one example `SkillCreatedEvent` message (payload
    and headers) as a shared test fixture
  - the producer's IT shows that adding a competence puts a message equal
    to the example on the destination, trace header included
  - the consumer's IT publishes the example and shows an email for each
    matching subscription, and that a message that fails processing lands
    in the DLQ
- A bug the new tests find is fixed in this task when it is small, and
  becomes a task otherwise.

## Constraints

- The RabbitMQ Testcontainers image is pinned to the version k3d runs,
  as pinned by [iteration 0 task 05](../iteration-0/05-compose-infra-only.md).
- Starts after [task 08](08-competence-profile-hexagonal.md): the tests are
  written against competence-profile-service's hexagonal layout.
- The validation decision recorded in
  [task 04](04-employee-service-tests.md) binds this task too.
- The two sides agree through the shared example message in `osaan-core`,
  each module testing against its own RabbitMQ container. No cross-service
  test module; the end-to-end flow is k3d's to cover. Decided by the PO at
  refinement.
- The consumer IT checks the email through a mocked `JavaMailSender`,
  capturing recipient, subject and body. No SMTP test server or new
  dependency. Decided by the PO at refinement.

## Open questions

**None.**

## Acceptance criteria

- [ ] `make verify COMPONENTS=competence-profile-service,competence-matching-service`
      runs a test class for each layer in Scope, and they pass
- [ ] Renaming a field in the shared example message makes the producer
      IT fail (shown once locally)
- [ ] The consumer IT shows a failing message in the dead-letter queue
- [ ] The REST client test covers the circuit breaker's fallback
