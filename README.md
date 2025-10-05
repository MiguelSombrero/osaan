# osaan

Osaan is my hobby project for studying different aspects of microservice development.

Osaan is knowledge management system and it tries to answer guestion:

"I need to create a team with different skill sets. I need one Java professional with at least 4/5 knowledge and two React professionals of 3/5 knowledge.
How do I find those people inside my company?"

## Stack

- Microservices - Spring Boot
- Databases - PostgreSQL
- Domain events - RabbitMQ
- Tracing - Micrometer Tracing, Zipkin
- Monitoring - Prometheus, Grafana
- Resilience - Resilience4j

## UI

Osaan system does not contain UI yet, but there are multiple management UI:s for development:

- Mail: http://localhost:8025
- Zipkin: http://localhost:9411
- RabbitMQ: http://localhost:15672 (guest/guest)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

Addresses are for localhost development. In Kubernetes, see Route/Gateway definitions.

## Run

There is 3 options for running Osaan system:

1) From IDE
2) Docker Dompose
3) OpenShift (Kubernetes)

### 1) From IDE

Start all microservices from `/microservices` folder (exept osaan-core which is library) in IDE with profile `spring.profiles.active=local`. Each microservice has `compose.yaml` file in root, which will start the necessary dependencies for that service.

### 2) Docker Compose

Prerequisites: microservices are build with maven (Dockerfile does not build applicaitons, only copies `/target/*.jar` to build image)

```bash
docker compose build
```

```bash
docker compose up -d
```

### 3) OpenShift Local

Prerequisites: [OpenShift Local (CRC)](https://developers.redhat.com/products/openshift-local/overview) is installed on your machine and cluster is created.

#### Start cluster

```bash
crc start
```

#### Login to cluster

```bash
oc login -u kubeadmin https://api.crc.testing:6443 
```

#### Install Operators

RabbitMQ Operator:

```bash
oc apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
```

SealedSecrets Operator:

```bash
oc apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.32.2/controller.yaml
```

Operators that are to be found in Red Har Marketplace:

```bash
oc apply -f manifests/platform/subscriptions.yaml
```

Istio:

**NOTE: There is a bug in OpenShift 4.19.8 which prevents of installin Istio. Have to wait an update to CRC. Error is:**

**Error: failed to install manifests: failed to update resource with server-side apply for obj NetworkAttachmentDefinition/default/istio-cni: network-attachment-definitions.k8s.cni.cncf.io "istio-cni" is forbidden: expression 'oldObject == null || object == null || object.spec != oldObject.spec' resulted in error: no such key: spec**

Install Istio according to [documentation](https://istio.io/latest/docs/setup/platform-setup/openshift/).

#### Deploy

First install Operators and all the platform specific resources to cluster:

```bash
oc apply -f manifests/platform
```

After installation is complete, deploy microservices with Kustomization:

```bash
oc apply -k .
```

## Use (OpenShift)

Default skills and employees is created on startup, for details look up `src/main/resources/data.sql` scripts of microservices.

You can create competence profiles for employees and subscribe for new skills.

### Add subscription for skill

```bash
curl -k -X POST https://competence-matching-service-route-osaan-dev.apps-crc.testing/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"skill":"java","rating":5,"email":"anna.korhonen@example.com"}'
```

### Add competence to employee

```bash
curl -k -X POST https://competence-profile-service-route-osaan-dev.apps-crc.testing/v1/competences/d8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2 \
  -H "Content-Type: application/json" \
  -d '[{"skillId":"a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5","rating":5}]'
```

This fires SkillCreatedEvent and if there is subscriptions for that skill level, email is sent to subscribers.

## Notes and instructions

### How to create SealedSecrets from Secrets

Example:

```bash
oc get secret postgres-secret -n osaan-dev -o yaml | kubeseal \
  --controller-namespace=kube-system \
  --controller-name=sealed-secrets-controller \
  --format=yaml > manifests/platform/sealedsecret.yaml
```