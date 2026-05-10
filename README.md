# osaan

Osaan is my hobby project for studying different aspects of fullstack development in microservice landscape.

**This project is not production ready! It is under slow development for hobby purposes.**

Osaan is a knowledge management system built on a microservice landscape. Project managers can search for employees with specific skill sets. Employees maintain competence profiles; managers can subscribe to skill-set criteria and receive email notifications when a matching profile is added; managers can add employees to teams and see easily overall competence of the team.

## Table of Contents

- [UI](#ui)
  - [Osaan Admin UI](#osaan-admin-ui)
  - [Osaan UI](#osaan-ui)
  - [Management UIs](#management-uis)
    - [Local](#local)
    - [Kubernetes](#kubernetes)
- [Test Data](#test-data)
- [Develop](#develop)
  - [IDE](#ide)
  - [Docker Compose](#docker-compose)
  - [Kubernetes](#kubernetes)
- [Bugs, issues and TODOs](#bugs-issues-and-todos)

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full system architecture — microservices, UIs, and platform dependencies.

See [docs/devops.md](docs/devops.md) for the CI/CD pipeline and Kubernetes platform setup.

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
- Grafana: http://grafana.local:9080 (admin/admin)
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

See [docs/develop.md](docs/develop.md) for detailed instructions on how to develop Osaan system.

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
