# Microservices

Four Spring Boot services and the shared `osaan-core` Maven library.
See the [architecture](../docs/architecture.md) for service responsibilities.

## Run locally

Use Java 25 and Maven. From the repository root, run `make up` to start
[shared infrastructure](../README.md#local-infrastructure) and install the
shared library once or after it changes.

```bash
(cd microservices/osaan-core && mvn clean install -DskipTests)
```

Start each service from its own directory, substituting the name below.
In an IDE, set `spring.profiles.active=local`.

```bash
cd microservices/<service-name>
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

| Service | Local port | Swagger UI |
|---|---:|---|
| employee-service | 8091 | [Swagger](http://localhost:8091/swagger-ui/index.html) |
| skill-catalog-service | 8092 | [Swagger](http://localhost:8092/swagger-ui/index.html) |
| competence-profile-service | 8093 | [Swagger](http://localhost:8093/swagger-ui/index.html) |
| competence-matching-service | 8094 | [Swagger](http://localhost:8094/swagger-ui/index.html) |
| osaan-core | — | Shared library |

The `local` profile disables authentication. Use the
[k3d stack](../README.md#kubernetes) to exercise sign-in and user-specific
flows. Known local gaps are tracked in [iteration 1 task 09](../docs/tasks/iteration-1/09-local-auth-disabled.md).

## Test and build

Run these in a service directory after installing `osaan-core`:

```bash
mvn test
# One class or one method in skill-catalog-service
mvn test -Dtest=SkillControllerTest
mvn test -Dtest=SkillControllerTest#getSkill_existingId_returns200WithSkillData
mvn clean package
mvn clean verify
```

`mvn test` runs unit and Spring context tests. In skill-catalog-service,
Maven Failsafe also runs `*IT.java` during `mvn verify`. Context and
repository tests that start PostgreSQL with Testcontainers need a running
Docker daemon. Further integration test work is tracked in
[iteration 1](../docs/tasks/iteration-1.md).

Skill-catalog-service is the reference suite.

| Layer | Tools | Examples |
|---|---|---|
| Domain | JUnit 5, AssertJ | `SkillTest`, `SkillNameTest` |
| Application | JUnit 5, Mockito | `ManageSkillsServiceTest` |
| Controller | Spring MVC Test, Mockito | `SkillControllerTest`, `AdminSkillControllerTest` |
| Security | Spring Security Test | `SecurityConfigTest` |
| Repository | Testcontainers, `@ServiceConnection` | `CachingSkillRepositoryIntegrationIT` |

From the repository root, `make build-services` packages all five Maven
modules without tests. It uses the locally installed `osaan-core` dependency.

### Publish a multi-architecture image manually

After logging in to Docker Hub, run the command from the service directory.
For example, from `microservices/competence-matching-service`:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-competence-matching-service:latest --push .
```

If Buildx reports that the Docker driver does not support multi-platform
builds, create a builder with the `docker-container` driver, then retry.

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```
