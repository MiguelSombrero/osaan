---
applyTo: "**/*.java,**/application*.yml,**/application*.yaml,**/application*.properties"
---

# Copilot Instructions – Java Spring Boot Web Application

## Project Overview

- Java Spring Boot 4 web application using a RESTful API
- Build tool: **Maven** (never Gradle)
- Language: **Java 25** — use latest language features (records, sealed classes, pattern matching, text blocks, virtual threads where applicable)
- Architecture: **Domain-Driven Design (DDD)** with **Hexagonal Architecture** (Ports & Adapters)
- In simple or small modules the structure may be flattened; prefer clarity over strict layering in trivial cases

## Technology Stack

- **Spring Boot 4** / **Spring Framework 7** / **Spring Security 7** — always use the latest major versions; never use deprecated classes or APIs
- **Spring Data JPA** + Hibernate for persistence
- **PostgreSQL** (TestContainers in integration tests)
- **Flyway** for database migrations
- **MapStruct** for object mapping
- **SpringDoc OpenAPI 3** for API documentation
- **Jakarta Bean Validation 4** (`jakarta.validation`) for validation
- **JUnit 5** + Mockito + AssertJ + Testcontainers for testing
- **Micrometer** + **Spring Actuator** for observability
- **Spring Cache** + Caffeine (local) and Redis (other) for caching

## Project Structure (Hexagonal / DDD)

```
src/main/java/com/example/app/
├── domain/
│   ├── model/          # Entities, value objects, aggregates, domain events
│   ├── port/
│   │   ├── in/         # Use case interfaces (driving ports)
│   │   └── out/        # Repository / external service interfaces (driven ports)
│   └── service/        # Domain services and use case implementations
├── application/
│   └── usecase/        # Application-layer orchestrators (thin, delegate to domain)
├── adapter/
│   ├── in/
│   │   └── web/        # REST controllers (@RestController)
│   └── out/
│       ├── persistence/ # JPA repositories, entity mappers
│       └── external/   # HTTP clients, messaging adapters
├── config/             # Spring @Configuration classes only
└── Application.java    # Main entry point only — no logic
```

- Domain layer has **zero** Spring or Jakarta dependencies
- Adapters depend on domain ports; domain never depends on adapters
- One class per file; package names are lowercase singular nouns

## Naming Conventions

- Controllers: `UserController`, Services/use-cases: `CreateUserUseCase`, Implementations: `CreateUserService`
- Repositories (port): `UserRepository`, JPA adapter: `JpaUserRepository`
- Entities: singular nouns without suffix (`User`, `Order`)
- DTOs: `CreateUserRequest`, `UserResponse` — use Java records where possible
- Mappers: `UserMapper`, Exceptions: `UserNotFoundException`, Config: `SecurityConfig`
- Methods: verb-noun pairs (`createUser`, `findById`); booleans: `isActive`, `hasPermission`
- Constants: `SCREAMING_SNAKE_CASE`; variables: `camelCase`
- Avoid generic names: `process()`, `handle()`, `doStuff()`

## Dependency Injection

- Always use **constructor injection** — never field injection (`@Autowired` on fields)
- Use Lombok `@RequiredArgsConstructor`; mark all injected fields `private final`
- Register beans via `@Configuration` classes, not component scanning where ambiguous

## REST API Design

- Base path: `/api/v1/resource` — always version the API
- Resource names: plural nouns (`/users`, `/orders`)
- HTTP verbs: GET (read), POST (create → 201 + Location header), PUT (full update → 200), PATCH (partial → 200), DELETE (→ 204)
- Return `ResponseEntity<T>` with explicit HTTP status from controllers
- All list endpoints must be paginated using Spring's `Pageable`; never return unbounded lists
- Consistent error response shape: `status`, `error`, `message`, `timestamp`, `path`
- Validation errors include a `fieldErrors` map with field-level messages

## Controllers

- Annotate with `@RestController` + `@RequestMapping`
- Keep methods under 15 lines — delegate all logic to use-case/service layer
- No business logic, no direct repository access, no `HttpServletRequest` in services
- Document endpoints with SpringDoc `@Operation` and `@Tag`

## Service / Domain Layer

- Domain services implement driving port interfaces
- Annotate read-only methods `@Transactional(readOnly = true)`, write methods `@Transactional`
- Apply `@PreAuthorize` at the service layer, not the controller
- Never swallow exceptions — rethrow or wrap in a domain-specific exception
- Use `Optional<T>` as return type when a value may be absent; never return `null` from public methods

## Data Layer & JPA

- JPA adapters implement driven port (repository) interfaces
- Use `Long` primary keys with `@GeneratedValue(strategy = IDENTITY)`
- All entities extend a `BaseEntity` with `@CreatedDate` / `@LastModifiedDate` (`LocalDateTime`)
- Use `@Column(nullable = false)` — don't rely solely on Bean Validation for DB constraints
- Prefer JPQL (`@Query`) over native SQL; use `@EntityGraph` to prevent N+1 queries
- Never call `findAll()` without `Pageable`
- All schema changes via **Flyway** — never use `ddl-auto=update`
- Migration naming: `V{version}__{description}.sql`; migrations are immutable once committed
- Do not use `@Data` on JPA entities — causes unsafe `equals`/`hashCode`

## Security

- Use Spring Security 7 `SecurityFilterChain` bean style — `WebSecurityConfigurerAdapter` is removed, never use it
- Authentication via JWT (stateless) — `BCryptPasswordEncoder` for passwords; never store plain text
- Authorize with `@PreAuthorize` / `@Secured` at service layer; never check roles manually in business logic
- Secrets from environment variables or a secrets manager — **never hardcode**

## Error Handling

- Single `@RestControllerAdvice` handles all exceptions globally
- No try-catch in controllers for business exceptions
- Custom exception hierarchy: base `AppException extends RuntimeException`, then specific subclasses (e.g. `UserNotFoundException`, `EmailAlreadyExistsException`)
- Never expose stack traces in API responses

## Validation

- Jakarta Bean Validation annotations on DTO records/classes
- Annotate controller parameters with `@Valid`
- Cross-field validation via a custom `@Constraint` class — not manual `if` blocks in service
- Validate at the controller boundary; not inside domain services

## Testing

- **Services/use-cases**: unit tests with `@ExtendWith(MockitoExtension.class)` + mocks; min 80% coverage
- **Controllers**: slice tests with `@WebMvcTest`; min 80% coverage
- **JPA adapters**: slice tests with `@DataJpaTest` + TestContainers; min 80% coverage
- **Integration**: `@SpringBootTest` + Testcontainers for key flows
- Test naming pattern: `methodName_whenCondition_expectedBehavior`
- Use AssertJ (`assertThat`) — not JUnit `assertEquals`
- Use `given/when/then` BDD style with `BDDMockito`

## Logging

- SLF4J only via Lombok `@Slf4j` — never `System.out.println` or `java.util.logging`
- Use parameterized logging: `log.debug("User id={}", id)` — never string concatenation
- ERROR: unexpected failures; WARN: recoverable/client errors; INFO: lifecycle events; DEBUG: flow detail (dev only)
- Never log passwords, tokens, or PII

## Configuration

- All config in `application.yml`; environment-specific overrides in `application-{profile}.yml`
- Use pattern `logging.level.web: ${LOGGING_LEVEL_WEB:INFO}` with environment variables. Try to avoid overriding property in environment-specific profiles
- Bind multi-property config to `@ConfigurationProperties` typed records/classes — avoid scattered `@Value`
- Validate config with `@Validated` on the properties class

## Performance

- `@Transactional(readOnly = true)` on all read-only service methods
- Use `@Cacheable` / `@CacheEvict` for expensive, rarely-changing lookups
- `@Async` for fire-and-forget tasks (email, audit) — always define a custom `ThreadPoolTaskExecutor` bean
- Enable `spring.jpa.show-sql=true` in dev profile only

## Code Style

- Max method length: 30 lines; max class length: 300 lines — extract otherwise
- No magic numbers or strings — use named constants or enums
- Prefer immutability: `final` fields, records for DTOs, unmodifiable collections
- Use `instanceof` only with pattern matching (Java 21+)
- Lombok allowed: `@Getter`, `@Setter`, `@NoArgsConstructor`, `@RequiredArgsConstructor`, `@Builder`, `@Slf4j`, `@ToString(exclude={"password"})`, `@EqualsAndHashCode(onlyExplicitlyIncluded=true)`

## What to Avoid

- Field injection (`@Autowired` on fields)
- Returning `null` from public API methods
- Catching `Exception` silently
- Exposing JPA entities directly from controllers
- Business logic in controllers or JPA adapter classes
- `spring.jpa.hibernate.ddl-auto=update` in any non-test profile
- Deprecated Spring or Jakarta classes/APIs
- Hardcoded secrets or credentials anywhere in code
