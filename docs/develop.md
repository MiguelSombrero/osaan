# Develop

Usefull info for developers.

## Test Data

The following AI generated users are seeded for local development. Each user's username is also their password.

### Users

| Name            | Username | Role          | Profile type        |
| --------------- | -------- | ------------- | ------------------- |
| Anna Korhonen   | `anna`   | ADMIN         | Backend generalist  |
| Mikko Virtanen  | `mikko`  | MANAGER, USER | Frontend/UX         |
| Liisa Laine     | `liisa`  | USER          | Full-stack frontend |
| Jari Mäkinen    | `jari`   | USER          | Backend senior      |
| Sari Niemi      | `sari`   | USER          | Data/analytics      |
| Aleksi Järvinen | `aleksi` | USER          | Full-stack senior   |
| Kaisa Hautamäki | `kaisa`  | USER          | Frontend specialist |
| Timo Heikkinen  | `timo`   | USER          | DevOps/platform     |
| Emilia Salonen  | `emilia` | USER          | Java backend        |
| Petri Leinonen  | `petri`  | USER          | Tech lead           |

### Competence profiles

| Employee        | Skills (rating 1–5)                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anna Korhonen   | Java·3, TypeScript·4, PostgreSQL·3, Docker·2, Agile·4, Communication·3, Leadership·2                                                                                                    |
| Mikko Virtanen  | Python·2, JavaScript·4, UX Design·5, React·4, TypeScript·3, CSS·4, HTML·5, Tailwind CSS·3, Communication·4, Mentoring·3                                                                 |
| Liisa Laine     | Java·1, Python·2, JavaScript·3, UX Design·4, React·5, TypeScript·4, CSS·5, HTML·4, Tailwind CSS·4, Jest·3, Cypress·3, Agile·4                                                           |
| Jari Mäkinen    | Java·4, Python·3, SQL·4, PostgreSQL·5, Redis·3, Docker·4, Kubernetes·3, Agile·5, Scrum·4, TDD·3, Code Review·4, Problem Solving·5                                                       |
| Sari Niemi      | Python·4, R·3, SQL·5, PostgreSQL·4, Elasticsearch·3, Docker·2, Agile·3, Communication·4, Leadership·3, Critical Thinking·5, Problem Solving·4, Adaptability·3                           |
| Aleksi Järvinen | Java·5, JavaScript·4, TypeScript·5, React·4, Node.js·3, SQL·4, PostgreSQL·3, Docker·5, Kubernetes·4, GitHub Actions·4, Agile·4, TDD·4, Code Review·3, Teamwork·4, Problem Solving·4     |
| Kaisa Hautamäki | JavaScript·5, TypeScript·4, React·5, Vue.js·3, CSS·5, HTML·5, Sass·4, Tailwind CSS·4, Jest·4, Cypress·3, Webpack·3, Vite·4, UX Design·4, Agile·3, Communication·5                       |
| Timo Heikkinen  | Java·2, Docker·5, Kubernetes·5, Helm·4, Terraform·4, Ansible·3, Jenkins·4, GitLab CI·5, GitHub Actions·4, ArgoCD·4, Prometheus·4, Grafana·4, AWS·4, Azure·3, Agile·3                    |
| Emilia Salonen  | Java·5, Kotlin·4, SQL·4, PostgreSQL·4, Redis·3, Kafka·4, RabbitMQ·3, Docker·4, Agile·4, Scrum·4, TDD·5, JUnit·5, Mockito·4, Problem Solving·5, Communication·3                          |
| Petri Leinonen  | Java·4, JavaScript·3, Python·2, TypeScript·3, SQL·4, Docker·4, Kubernetes·3, AWS·4, Agile·5, Scrum·5, Leadership·5, Mentoring·5, Code Review·5, Pair Programming·4, Critical Thinking·4 |

Java appears in 7 employees with ratings 1–5, making it especially useful for testing search and filtering scenarios.

## Bugs, issues and TODOs

- Add subscription/id page for showing employees with specific competence

- Upgrade to Typescript 7

- Is osaan-admin-ui working in k3d?

- Draw component diagram of the system landscape

- Make microservices configuration better

- Tracing works in k3d - test that it work in Docker Compose too

- Add Zustand store for osaan-ui

- Add some library for generating API related models

- Add log aggregation tool in k3d cluster

- Debug why Testkube containers not created with Triggers

- Refactor setup-cluster script (lots of secret creation)

- Add lots of cool stuff in osaan-ui

- Add toast notifications for user actions in osaan-admin-ui

- Change keycloak initial admin passwords

- CI/CD relesea pipelines

- Testing improvements
  - Integration tests for microservices
  - More e2e tests with Playwright
  - Notifications when TestWorkflow fails
  - UI for watching Playwright reports

## Notes for developer

### Build and push multi-arch image

Requires login to Docker Hub. Run command in todo-app directory.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-competence-matching-service:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```
