# Microservices — agent conventions

Loaded when you work under `microservices/`. Java 25, Spring Boot 4, Maven.

## Commands

```bash
cd microservices/<service-name>
mvn clean package                                   # build
mvn spring-boot:run -Dspring.profiles.active=local  # run; compose.yaml starts dependencies
mvn test                                            # all tests
mvn test -Dtest=SkillControllerTest                 # one class
mvn test -Dtest=SkillControllerTest#getSkill_returnsSkill  # one method
```

Install `osaan-core` first when it changed: `(cd microservices/osaan-core && mvn install)`.
Integration tests are named `*IT.java` and start a real PostgreSQL with
Testcontainers. When running in an IDE, start `competence-matching-service`
first: its `compose.yaml` holds the shared infrastructure.

## Layout: DDD + hexagonal (ports and adapters)

Base package: `com.github.miguelsombrero.osaan.<service_snake_case>`.

- `api/` — REST controllers, request/response DTOs (records), API mappers
- `application/` — port interfaces, application services
- `domain/` — entities, value objects, domain repository interfaces
- `infrastructure/` — driven adapters (`persistence/`, `cache/`, `client/`, `config/`)

**Refactoring policy:** do not restructure package layout or architecture
without asking first. The one standing exception: when already editing a
service for another reason, moving the classes you touch toward the layout
above is fine. Re-laying out a whole service is a separate task.

## Java conventions

- Constructor injection only — Lombok `@RequiredArgsConstructor`, `private final` fields
- Do **not** use `var`; use explicit types
- Business logic in the domain layer, not in controllers or infrastructure adapters
- One class per file

## Testing

Follow `skill-catalog-service`, the most fully tested service.

| Layer | Test type | Tools | Canonical example |
|---|---|---|---|
| Domain entity / value object | Pure unit test | JUnit 5 + AssertJ | `SkillTest`, `SkillNameTest` |
| Service | Unit test with mocks | JUnit 5 + Mockito | `CompetenceServiceTest`, `ManageSkillsServiceTest` |
| Controller | MockMvc unit test | Spring MVC Test + Mockito | `SkillControllerTest`, `AdminSkillControllerTest` |
| Repository (custom queries) | Testcontainers integration test | `@Testcontainers` + `@ServiceConnection` | `CompetenceRepositoryIT` |

**Test:** business logic in entities and services; every controller endpoint,
happy path plus 400/404/403; custom repository queries; security and role
requirements on endpoints.

**Skip:** generated Spring Data CRUD methods, context-load tests, trivial
getters, setters and mappers.

**Patterns:**

- `@ExtendWith(MockitoExtension.class)` + `@InjectMocks` / `@Mock` for service and controller unit tests
- `MockMvcBuilders.standaloneSetup(controller)` — no full Spring context
- `ArgumentCaptor` to assert on what was passed to mocked collaborators
- Share Testcontainers configuration via `@Import(TestcontainersConfiguration.class)`
