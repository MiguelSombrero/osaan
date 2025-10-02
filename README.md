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

## Usage

### Add Skills

```bash
curl -X POST http://localhost:8092/v1/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"React"}'
```

### Add Employees

```bash
curl -X POST http://localhost:8091/v1/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john.doe@test.com"}'
```

### Add skills to employees

```bash
curl -X POST http://localhost:8093/v1/competences \
  -H "Content-Type: application/json" \
  -d '[{"employeeId":"52718fc1-2455-4994-b699-82ae5a9d4c9f","skillId":"cc8d8374-ee8f-45e7-9dea-39fa99969ac6","rating":2}]'
```

### Get employees with skill

```bash
curl -X GET http://localhost:8093/v1/competences/search?skill=Python&rating=2
```

## Notes and instructions

### How to create SealedSecrets from Secrets

Example:

```bash
oc get secret postgres-secret -n osaan-dev -o yaml | kubeseal \
  --controller-namespace=kube-system \
  --controller-name=sealed-secrets-controller \
  --format=yaml > manifests/platform/sealedsecret.yaml
```