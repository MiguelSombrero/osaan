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
  - [CI/CD](#cicd)
  - [Platform](#platform)
- [UI](#ui)
  - [Osaan Admin UI](#osaan-admin-ui-1)
  - [Osaan UI](#osaan-ui-1)
  - [Management UIs](#management-uis)
    - [Local](#local)
    - [Kubernetes](#kubernetes)
- [Run](#run)
  - [1) IDE](#1-ide)
  - [2) Docker Compose](#2-docker-compose)
  - [3) Kubernetes](#3-kubernetes)
- [Deploy](#deploy)
- [Notes and instructions](#notes-and-instructions)
  - [How to create SealedSecrets from Secrets](#how-to-create-sealedsecrets-from-secrets)
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

### CI/CD

- CI/CD - GitHub Actions
- Deployment - ArgoCD

### Platform

- Kubernetes - k3d
- Service Mesh - Istio

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
docker compose up -d --build
```

### 3) Kubernetes

These instructions are k3d specific but can be applied to other Kubernetes distributions as well.

Prerequisites for running `setup-cluster.sh` script:

- k3d
- kubectl
- operator-sdk
- istioctl
- helm
- sops

First make a copy of `manifests/environments/osaan-dev/secrets-template.yaml.example` and encrypt it with SOPS:

```bash
sops encrypt \
 --age <AGE_PUBLIC_KEY> \
 --encrypted-regex '^(stringData)$' \
 secrets-template.yaml > secrets.enc.yaml
```

Push encrypted Secrets to GitHub (ArgoCD watches Git repository for changes). Then create cluster and install all necessary operators etc. with script:

```bash
  ./setup-cluster.sh
```

## Deploy

ArgoCD that was installed previous step will sync all the resources in `kustomization.yaml` file to the cluster.

If needed, you can apply manifests manually with command:

```bash
kubectl apply -k .
```

## Bugs, issues and TODOs

- Lots of cool stuff in osaan-ui

- Add toast notifications for user actions in osaan-admin-ui

- Build pipeline optimization: do not update kustomization.yaml if pipeline fails

- Change keycloak initial admin passwords

- Refactoring manifests and maybe using Helm

- CI/CD relesea pipelines

- Authentication on microservices

- Integration tests for microservices

- Tracing is not working for osaan-admin-backend (Jaeger not showing spans)
