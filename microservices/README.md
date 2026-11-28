# Microservices

Four Spring Boot services and the shared `osaan-core` Maven library.
See the [architecture](../docs/architecture.md) for service responsibilities.

## Run locally

Use Java 25. From the repository root, run `make up` to start the
[shared infrastructure](../README.md#local-infrastructure). Then package
and run a service from `microservices/`. Substitute the service name as
needed. In an IDE, set `spring.profiles.active=local`.

```bash
cd microservices
./mvnw -pl employee-service -am clean package -DskipTests
java -jar employee-service/target/employee-service-*.jar --spring.profiles.active=local
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

Run these from `microservices/`. The wrapper pins Maven and `-am` builds
`osaan-core` alongside the selected service.

```bash
./mvnw verify
./mvnw -pl skill-catalog-service -am verify
# One class or one method in skill-catalog-service
./mvnw -pl skill-catalog-service -am test -Dtest=SkillControllerTest -Dsurefire.failIfNoSpecifiedTests=false
./mvnw -pl skill-catalog-service -am test -Dtest=SkillControllerTest#getSkill_existingId_returns200WithSkillData -Dsurefire.failIfNoSpecifiedTests=false
```

`./mvnw test` runs unit and Spring context tests. Maven Failsafe also runs
`*IT.java` in every module during `./mvnw verify`. Context and
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
modules without tests.

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
