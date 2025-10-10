# osaan

Osaan is my hobby project for studying different aspects of microservice development.

Osaan is knowledge management system and it tries to answer guestion:

"I need to create a team with different skill sets. I need one Java professional with at least 4/5 knowledge and two React professionals of 3/5 knowledge.
How do I find those people inside my company?"

## Stack

- Microservices - Spring Boot
- Databases - PostgreSQL
- Domain events - RabbitMQ
- Tracing - Micrometer Tracing, Zipkin (local), Jaeger (Kubernetes)
- Monitoring - Prometheus, Grafana
- Resilience - Resilience4j
- Service Mesh - Istio (Kubernetes)

## UI

Osaan system does not contain UI yet, but there are multiple management UI:s for development:

### Local

- Mail: http://localhost:8025
- Zipkin: http://localhost:9411
- RabbitMQ: http://localhost:15672 (guest/guest)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

### Kubernetes

- Kiali: http://kiali.localhost:9080
- Grafana: http://grafana.localhost:9080
- Jaeger: http://jaeger.localhost:9080
- Prometheus: http://prometheus.localhost:9080
- RabbitMQ: http://rabbit.localhost:9080
- Mailhog: http://mail.localhost:9080

In order to subdomain work add to your local `/etc/hosts`file:

```
  127.0.0.1 osaan.local
  127.0.0.1 grafana.local
  127.0.0.1 mail.local
  127.0.0.1 kiali.local
  27.0.0.1 prometheus.local
  127.0.0.1 rabbit.local
  127.0.0.1 jaeger.local
```

## Run

There are 3 options for running Osaan system:

1) IDE
2) Docker Dompose
3) Kubernetes

### 1) IDE

Start all microservices from `/microservices` folder (exept osaan-core which is library) in IDE with profile `spring.profiles.active=local`. Each microservice has `compose.yaml` file in root, which will start the necessary dependencies for that service.

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

Before deploying to newly created cluster, you have to recreate all the SealedSecrets. For instructions, see [How to create SealedSecrets from Secrets](#how-to-create-sealedSecrets-from-secrets)

SealedSecrets that needs to be recreated:

```
manifests/common/postgres-secret.yaml
```

Deploy microservices with Kustomization:

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