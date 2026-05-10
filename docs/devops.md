# DevOps & CI/CD Pipeline

## Pipeline overview

```
push to dev → GitHub Actions (test + build) → Docker Hub → ArgoCD Image Updater → k3d cluster
```

---

## CI — GitHub Actions

File: `.github/workflows/build.yml` — triggers on push to `dev` for changed paths only.

| Job                     | When                               | Output                                |
| ----------------------- | ---------------------------------- | ------------------------------------- |
| detect-changes          | always                             | matrix of changed components          |
| build-core              | `osaan-core/` or `pom.xml` changed | published to GitHub Packages (Maven)  |
| build-and-push-services | any microservice changed           | Docker Hub image (`latest` + SHA tag) |
| build-and-push-admin-ui | `ui/osaan-admin-ui/` changed       | Docker Hub image (`latest` + SHA tag) |
| build-and-push-osaan-ui | `ui/osaan-ui/` changed             | Docker Hub image (`latest` + SHA tag) |

- Maven tests run before image push for Java services
- Vitest runs before image push for UI services
- All images are multi-arch (`linux/amd64,linux/arm64`)

**Required CI secrets:** `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GITHUB_TOKEN`

---

## CD — ArgoCD GitOps

App-of-apps pattern. Root application (`argocd/app-of-apps.yaml`) watches `manifests/argocd-apps/` on branch `dev`. All apps: auto-sync + prune + self-heal.

### Applications

| App                    | Type           | Source                             | Namespace    | Wave |
| ---------------------- | -------------- | ---------------------------------- | ------------ | ---- |
| istio-base             | Application    | Helm (istio/base 1.29.2)           | istio-system | -2   |
| istiod                 | Application    | Helm (istio/istiod 1.29.2)         | istio-system | -1   |
| istio-ingressgateway   | Application    | Helm (istio/gateway 1.29.2)        | istio-system | -1   |
| argocd-platform        | Application    | `manifests/platform/`              | osaan-dev    | 0    |
| argocd-gateways        | Application    | `manifests/gateway/`               | istio-system | 0    |
| istio-addon-prometheus | Application    | Helm (prometheus-community 29.6.0) | istio-system | 0    |
| istio-addon-grafana    | Application    | Helm (grafana 10.5.15)             | istio-system | 0    |
| istio-addon-jaeger     | Application    | Helm (jaegertracing 4.7.0)         | istio-system | 0    |
| istio-addon-kiali      | Application    | Helm (kiali-server 1.30.0)         | istio-system | 0    |
| valkey                 | Application    | Helm (valkey.io 0.9.4)             | osaan-dev    | 0    |
| osaan-microservices    | ApplicationSet | `charts/osaan-microservice`        | osaan-dev    | 1    |
| osaan-ui-services      | ApplicationSet | `charts/osaan-ui`                  | osaan-dev    | 1    |
| argocd-testkube        | Application    | `manifests/testkube/`              | testkube     | 1    |

Waves: -2 (Istio CRDs) → -1 (Istio control plane + gateway) → 0 (platform + observability) → 1 (workloads).

### Image Updater

ArgoCD Image Updater polls Docker Hub for new image digests and commits updated refs back to `dev`. No manual tag management needed.

**Required:** `argocd-image-updater-secret` (GitHub write-back) and `argocd-image-updater-dockerhub` (registry polling) secrets in the `argocd` namespace — created by `setup-cluster.sh` when env vars are set.

---

## Platform — k3d cluster

Set up with `make setup-cluster` (runs `./setup-cluster.sh`).

| Component            | Version                        | Purpose                                     |
| -------------------- | ------------------------------ | ------------------------------------------- |
| k3d                  | latest                         | Local Kubernetes, 2 agents, ports 9080/9443 |
| Istio                | 1.29.2 (Helm, ArgoCD-managed)  | Service mesh + ingress gateways             |
| cert-manager         | v1.19.5                        | TLS certificates (self-signed CA)           |
| Keycloak             | 26.6.1                         | OAuth2 / IAM                                |
| PostgreSQL           | via CrunchyData operator       | Databases                                   |
| RabbitMQ             | via RabbitMQ operator          | Messaging                                   |
| Valkey               | 0.9.4 (Helm)                   | Redis-compatible cache                      |
| ArgoCD               | v3.3.8                         | GitOps controller                           |
| ArgoCD Image Updater | v1.2.0                         | Automatic image updates                     |
| External Secrets     | 2.4.0                          | Secret sync                                 |
| Testkube             | standalone                     | E2E test runner (Playwright)                |
| Mailhog              | —                              | Dev SMTP server                             |
| Prometheus           | 27.2.0 (Helm, ArgoCD-managed)  | Metrics                                     |
| Grafana              | 8.5.2 (Helm, ArgoCD-managed)   | Dashboards                                  |
| Jaeger               | 0.71.14 (Helm, ArgoCD-managed) | Distributed tracing                         |
| Kiali                | 2.6.0 (Helm, ArgoCD-managed)   | Service mesh observability                  |

Istio is installed via Helm (three charts: `istio/base`, `istio/istiod`, `istio/gateway`) and fully managed by ArgoCD (waves -2 and -1). Mesh config (access logging, tracing, sampling) lives in the `istiod` ArgoCD Application's Helm values — single source of truth in Git, reconciled automatically.

Script install order: OLM → namespaces → secrets → Istio (Helm bootstrap) → cert-manager → Keycloak → PostgreSQL operator → RabbitMQ operator → ArgoCD → Image Updater → External Secrets → Testkube → app-of-apps (ArgoCD then manages Istio + observability stack via sync waves).

---

## Secrets

Kubernetes secrets live in `manifests/environments/osaan-dev/secrets.enc.yaml`, encrypted with SOPS + age. Safe to commit.

```bash
# Encrypt
sops encrypt \
  --age <AGE_PUBLIC_KEY> \
  --encrypted-regex '^(stringData)$' \
  secrets-template.yaml > secrets.enc.yaml

# Decrypt and apply (done automatically by setup-cluster.sh)
sops --decrypt secrets.enc.yaml | kubectl apply -f -
```

---

## Cluster setup

Prerequisites: `k3d`, `kubectl`, `operator-sdk`, `helm`, `sops`, `keytool`, `docker`, `testkube`

```bash
# Set env vars first
export GITHUB_USERNAME=...
export GITHUB_TOKEN=...
export DOCKERHUB_USERNAME=...
export DOCKERHUB_TOKEN=...

make setup-cluster
```
