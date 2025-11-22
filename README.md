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

## Stack

### Frontend

- UI - React, Typecript, Material UI
- Backend - Node, Express
- Application state - Zustand
- Data fetching - Tanstack Query
- Session - Redis
- Authentication, IAM - OAuth2, Keycloak

### Backend

- Microservices - Spring Boot
- Databases - PostgreSQL
- Domain events - RabbitMQ
- Tracing - Micrometer Tracing, Zipkin (local), Jaeger (Kubernetes)
- Monitoring - Prometheus, Grafana
- Resilience - Resilience4j
- Service Mesh - Istio (Kubernetes)

### CI/CD

- CI/CD - GitHub Actions
- Deployment - ArgoCD

## UI

Osaan system contains two different UIs:

### Osaan Admin UI

Osaan Admin UI is for admins to create new skills and adding employees.

See [Osaan Admin UI documentation](https://github.com/MiguelSombrero/osaan/blob/main/ui/osaan-admin-ui/README.md) for more details on how to develop Osaan Admin UI.

#### Local

- With Vite (npm run dev): http://localhost:5173 (Login → admin/admin)
- With Docker Compose (docker compose up --build -d): http://localhost:8085 (Login → admin/admin)

#### Kubernetes

- Admin UI: https://osaan.admin.local:9443

### Osaan UI

NOT IMPLEMENTED YET!

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

## Run

There are 3 options for running Osaan system:

1. IDE
2. Docker Dompose
3. Kubernetes

### 1) IDE

Start all microservices from `/microservices` folder (exept osaan-core which is library) in IDE with profile `spring.profiles.active=local`. Each microservice has `compose.yaml` file in the project root, which will start the necessary dependencies for that service. Start `competence-matching-service` first as its `compose.yaml` file contains all the shared dependecies like RabbitMQ.

### 2) Docker Compose

Prerequisites: microservices are build with maven (Dockerfile does not build applicaitons, only copies `/target/*.jar` to build image)

```bash
docker compose build
```

```bash
docker compose up -d
```

### 3) Kubernetes

These instructions are k3d specific but can be applied to other Kubernetes distributions as well.

Create cluster and install all necessary operators etc. with script:

```bash
  ./setup-cluster.sh
```

OR create cluster manually with command:

```bash
k3d cluster create k3d-osaan-dev --api-port 6550 -p '9080:80@loadbalancer' -p '9443:443@loadbalancer' --agents 2 --k3s-arg '--disable=traefik@server:*'
```

AND install selected operators from `./setup-cluster.sh` script.

## Deploy

ArgoCD that was installed previous step will sync all the resources in `kustomization.yaml` file to the cluster.

You can apply manifests manually with command:

```bash
kubectl apply -k .
```

## Use (k3d)

Default skills and employees is created on startup, for details look up `src/main/resources/data.sql` scripts of microservices.

You can create competence profiles for employees and subscribe for new skills.

### Add subscription for skill

```bash
curl -X POST http://osaan.local:9080/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"skill":"java","rating":5,"email":"anna.korhonen@example.com"}'
```

### Add competence to employee

```bash
curl -X POST http://osaan.local:9080/v1/competences/d8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2 \
  -H "Content-Type: application/json" \
  -d '[{"skillId":"a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5","rating":5}]'
```

This fires SkillCreatedEvent and if there is subscriptions for that skill level, email is sent to subscribers.

### Search employees with skill and rating

```bash
curl -X GET http://osaan.local:9080/v1/competences/search?skill=Python&rating=2
```

## Notes and instructions

### How to create SealedSecrets from Secrets

Create Secret to file:

```bash
kubectl create secret generic postgres-secret \
--from-literal=POSTGRES_DB=osaan-db \
--from-literal=POSTGRES_USER=osaan-user \
--from-literal=POSTGRES_PASSWORD=osaan-password \
--namespace osaan-dev \
--dry-run=client -o yaml > secret.yaml
```

Create SealedSecret from Secret:

```bash
kubeseal \
--controller-namespace=kube-system \
--controller-name=sealed-secrets-controller \
-o yaml < secret.yaml > postgres-secret.yaml
```

## Bugs, issues and TODOs

- CI/CD pipelines

- Osaan-admin-ui role based rendering (only ADMINs)

- Localization in osaan-admin-ui

- Keycloak to use postgres-cluster

- ArgoCD for GitOps

- Authentication on microservices

- Integration tests for microservices

- Tracing is not working for osaan-admin-backend (Jaeger not showing spans)
