# DevOps & CI/CD Pipeline

## Pipeline overview

```
push to dev → GitHub Actions (test + build) → Docker Hub → ArgoCD Image Updater → k3d cluster
```

---

## CI — GitHub Actions

File: `.github/workflows/build.yml` — triggers on push to `dev` for changed paths only.

| Job | When | Output |
|-----|------|--------|
| detect-changes | always | matrix of changed components |
| build-core | `osaan-core/` or `pom.xml` changed | published to GitHub Packages (Maven) |
| build-and-push-services | any microservice changed | Docker Hub image (`latest` + SHA tag) |
| build-and-push-admin-ui | `ui/osaan-admin-ui/` changed | Docker Hub image (`latest` + SHA tag) |
| build-and-push-osaan-ui | `ui/osaan-ui/` changed | Docker Hub image (`latest` + SHA tag) |

- Maven tests run before image push for Java services
- Vitest runs before image push for UI services
- All images are multi-arch (`linux/amd64,linux/arm64`)

**Required CI secrets:** `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GITHUB_TOKEN`

---

## CD — ArgoCD GitOps

App-of-apps pattern. Root application (`argocd/app-of-apps.yaml`) watches `manifests/argocd-apps/` on branch `dev`. All apps: auto-sync + prune + self-heal.

### Applications

| App | Type | Source | Namespace | Wave |
|-----|------|--------|-----------|------|
| argocd-platform | Application | `manifests/platform/` | osaan-dev | 0 |
| argocd-gateways | Application | `manifests/gateway/` | istio-system | 0 |
| valkey | Application | Helm (valkey.io 0.9.4) | osaan-dev | 0 |
| osaan-microservices | ApplicationSet | `charts/osaan-microservice` | osaan-dev | 1 |
| osaan-ui-services | ApplicationSet | `charts/osaan-ui` | osaan-dev | 1 |
| argocd-testkube | Application | `manifests/testkube/` | testkube | 1 |

Wave 0 deploys infrastructure first; wave 1 deploys workloads after.

### Image Updater

ArgoCD Image Updater polls Docker Hub for new image digests and commits updated refs back to `dev`. No manual tag management needed.

**Required:** `argocd-image-updater-secret` (GitHub write-back) and `argocd-image-updater-dockerhub` (registry polling) secrets in the `argocd` namespace — created by `setup-cluster.sh` when env vars are set.

---

## Platform — k3d cluster

Set up with `make setup-cluster` (runs `./setup-cluster.sh`).

| Component | Version | Purpose |
|-----------|---------|---------|
| k3d | latest | Local Kubernetes, 2 agents, ports 9080/9443 |
| Istio | 1.29.2 | Service mesh + ingress gateways |
| cert-manager | v1.19.5 | TLS certificates (self-signed CA) |
| Keycloak | 26.6.1 | OAuth2 / IAM |
| PostgreSQL | via CrunchyData operator | Databases |
| RabbitMQ | via RabbitMQ operator | Messaging |
| Valkey | 0.9.4 (Helm) | Redis-compatible cache |
| ArgoCD | v3.3.8 | GitOps controller |
| ArgoCD Image Updater | stable | Automatic image updates |
| External Secrets | 2.4.0 | Secret sync |
| Testkube | standalone | E2E test runner (Playwright) |
| Mailhog | — | Dev SMTP server |
| Prometheus + Grafana + Kiali + Jaeger | — | Observability |

Script install order: OLM → namespaces → secrets → Istio → cert-manager → Keycloak → PostgreSQL operator → RabbitMQ operator → ArgoCD → Image Updater → External Secrets → Testkube → app-of-apps.

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
