# osaan

Osaan is my hobby project for studying different aspects of fullstack development in microservice landscape.

**This project is not production ready! It is under slow development for hobby purposes.**

Osaan is knowledge management system and it tries to answer guestion:

I'm a project manager and need to create a team with different skill sets. I need for example:

- Java professional with > 4/5 knowledge
- Two React professionals with > 3/5 knowledge
- Someone with any knowledge of PL/1

How do I find those people inside my company?

With Osaan System you can (eventually) create skill profiles for employees, subscribe for specific skill profiles and
get notified via email when matching profiles are added. You can create and manage teams for specific projects and needs.

## Table of Contents

- [Stack](#stack)
  - [Osaan UI](#osaan-ui)
  - [Osaan Admin UI](#osaan-admin-ui)
  - [Microservices](#microservices)
  - [CI/CD & Platform](#cicd--platform)
- [UI](#ui)
  - [Osaan Admin UI](#osaan-admin-ui-1)
  - [Osaan UI](#osaan-ui-1)
  - [Management UIs](#management-uis)
    - [Local](#local)
    - [Kubernetes](#kubernetes)
- [Test Data](#test-data)
- [Develop](#develop)
  - [IDE](#ide)
  - [Docker Compose](#docker-compose)
  - [Kubernetes](#kubernetes)
- [Bugs, issues and TODOs](#bugs-issues-and-todos)

## Stack

### Osaan UI

- UI - Next.js, TypeScript, Tailwind CSS
- Data fetching - Tanstack Query, Next,js API routes
- Session - Redis
- Authentication, IAM - OAuth2, Keycloak

### Osaan Admin UI

- UI - React, Typecript, Material UI
- Backend - Node, Express
- Application state - Zustand
- Data fetching - Tanstack Query
- Session - Redis
- Authentication, IAM - OAuth2, Keycloak

### Microservices

- Microservices - Spring Boot
- Databases - PostgreSQL
- Domain events - RabbitMQ
- Tracing - Micrometer Tracing, Zipkin (local), Jaeger (Kubernetes)
- Monitoring - Prometheus, Grafana
- Resilience - Resilience4j

### CI/CD & Platform

See [docs/devops.md](docs/devops.md) for the full CI/CD pipeline and platform setup.

## UI

Osaan system contains two different UIs:

### Osaan Admin UI

Osaan Admin UI is for admins to create new skills and adding employees.

See [Osaan Admin UI documentation](https://github.com/MiguelSombrero/osaan/blob/main/ui/osaan-admin-ui/README.md) for more details on Osaan Admin UI.

### Osaan UI

Osaan UI is for users and managers to create and subscribe to competence profiles.

See [Osaan UI documentation](https://github.com/MiguelSombrero/osaan/blob/main/ui/osaan-ui/README.md) for more details on Osaan UI.

### Management UIs

There are also multiple management UI:s for development:

#### Local

- Mail: http://localhost:8025
- Zipkin: http://localhost:9411
- RabbitMQ: http://localhost:15672 (guest/guest)
- Keycloak: https://localhost:8443 (admin/admin) (docker compose only)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

#### Kubernetes

- Kiali: http://kiali.local:9080
- Grafana: http://grafana.local:9080
- Jaeger: http://jaeger.local:9080
- Prometheus: http://prometheus.local:9080
- RabbitMQ: http://rabbit.local:9080
- Mailhog: http://mail.local:9080
- Keycloak: https://keycloak.local:9443
- ArgoCD: https://argocd.local:9443

For subdomain to work add to your local `/etc/hosts`file:

```
  127.0.0.1 osaan.admin.local
  127.0.0.1 osaan.local
  127.0.0.1 grafana.local
  127.0.0.1 mail.local
  127.0.0.1 kiali.local
  127.0.0.1 prometheus.local
  127.0.0.1 rabbit.local
  127.0.0.1 jaeger.local
  127.0.0.1 keycloak
  127.0.0.1 keycloak.local
  127.0.0.1 argocd.local
```

## Develop

There are 3 options for running Osaan system locally:

1. IDE
2. Docker Dompose
3. Kubernetes

### IDE

Start all microservices from `/microservices` folder (exept osaan-core which is library) in IDE with profile `spring.profiles.active=local`. Each microservice has `compose.yaml` file in the project root, which will start the necessary dependencies for that service. Start `competence-matching-service` first as its `compose.yaml` file contains all the shared dependecies like RabbitMQ.

### Docker Compose

When there is changes in microservices:

```bash
make up
```

When there is not changes:

```bash
make up-no-build
```

### Kubernetes

Set up with `make setup-cluster` (runs `./setup-cluster.sh`).

See [docs/devops.md](docs/devops.md) for cluster setup, prerequisites, and secrets.

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

- Lots of cool stuff in osaan-ui

- Add toast notifications for user actions in osaan-admin-ui

- Change keycloak initial admin passwords

- CI/CD relesea pipelines

- Testing improvements
  - Integration tests for microservices
  - More e2e tests with Playwright
  - Notifications when TestWorkflow fails
  - UI for watching Playwright reports

- Tracing is not working for osaan-admin-backend (Jaeger not showing spans)

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
