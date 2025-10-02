# osaan

Knowledge management system

## Run with Docker Compose

Prerequisites: microservices are build with maven

```bash
docker compose build
```

```bash
docker compose up -d
```

## Install to OpenShift Local

Prerequisites: OpenShift Local is installed on your machine.

### Start cluster

```bash
crc start
```

### Login to cluster

```bash
oc login -u kubeadmin https://api.crc.testing:6443 
```

### Install RabbitMQ Operator

```bash
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
```

#### Install SealedSecrets Operator

```bash
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.32.2/controller.yaml
```

## Usage (OpenShift)

Default skills and employees is created on startup. You can create competence profiles for employees and subscribe for new skills.

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