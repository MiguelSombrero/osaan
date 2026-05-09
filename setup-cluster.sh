#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# VERSION PINS — change here when upgrading a component
# ============================================================
CLUSTER_NAME="osaan-dev"                        # k3d prefixes context → k3d-osaan-dev
EXPECTED_CONTEXT="k3d-${CLUSTER_NAME}"
BACKUP_DIR="${HOME}/.osaan/backup"
K3D_STORAGE_DIR="${HOME}/.osaan/k3d-storage"    # persistent; survives reboots

# Verify each version at the linked release pages before changing
ISTIO_VERSION="1.29.2"          # https://istio.io/latest/docs/releases/supported-releases/
CERT_MANAGER_VERSION="v1.19.5"  # https://github.com/cert-manager/cert-manager/releases
KEYCLOAK_VERSION="26.6.1"       # https://github.com/keycloak/keycloak-k8s-resources/tags
ARGOCD_VERSION="v3.3.8"         # https://github.com/argoproj/argo-cd/releases
EXTERNAL_SECRETS_CHART_VERSION="2.4.0"   # https://github.com/external-secrets/external-secrets/releases
# ============================================================

echo "===================================================="
echo "  Setting up local Kubernetes cluster: ${CLUSTER_NAME}"
echo "===================================================="

# --- 1. Tarkista että k3d on asennettu ---
if ! command -v k3d >/dev/null 2>&1; then
  echo "❌ k3d is not installed. Please install it first: https://k3d.io/"
  exit 1
fi

# --- 2. Tarkista että kaikki tarvittavat työkalut on asennettu ---
check_prereqs() {
  local missing=()
  for cmd in kubectl helm operator-sdk sops keytool docker testkube; do
    command -v "$cmd" >/dev/null 2>&1 || missing+=("$cmd")
  done
  if [[ ${#missing[@]} -gt 0 ]]; then
    echo "❌ Missing required tools: ${missing[*]}"
    echo "   Install them before running this script."
    exit 1
  fi
  echo "✅ All prerequisite tools found"
}
check_prereqs

# --- 3. Tarkista onko klusteri jo olemassa ---
if ! k3d cluster list | grep -q "${CLUSTER_NAME}"; then
  echo "==> Cluster '${CLUSTER_NAME}' not found. Creating it..."
  mkdir -p "${K3D_STORAGE_DIR}"
  k3d cluster create "${CLUSTER_NAME}" \
    --api-port 6550 \
    -p '9080:80@loadbalancer' \
    -p '443:443@loadbalancer' \
    -p '9443:443@loadbalancer' \
    --volume "${K3D_STORAGE_DIR}:/var/lib/rancher/k3s/storage@all" \
    --agents 2 \
    --k3s-arg '--disable=traefik@server:*'
else
  echo "✅ Cluster '${CLUSTER_NAME}' already exists."
fi

# --- 4. Tarkista että ollaan oikeassa klusterissa ---
current_context=$(kubectl config current-context)
if [[ "$current_context" != "$EXPECTED_CONTEXT" ]]; then
  echo "❌ Current kubectl context is '$current_context'."
  echo "Please switch to the expected context '$EXPECTED_CONTEXT' before running this script:"
  echo "   kubectl config use-context $EXPECTED_CONTEXT"
  exit 1
else
  echo "✅ kubectl is using the correct context: $current_context"
fi

# --- 5. Odota että klusteri on käyttövalmis ---
echo "==> Waiting for cluster to become ready..."
kubectl cluster-info >/dev/null

# --- Helper-funktio odottamaan deploymenteja ---
wait_for_deployments() {
  local namespace=$1
  echo "⏳ Waiting for deployments in namespace '$namespace'..."
  # Odotetaan että namespace ilmestyy
  until kubectl get ns "$namespace" >/dev/null 2>&1; do
    sleep 2
  done

  # Odotetaan että deploymentit ovat näkyvissä
  until kubectl -n "$namespace" get deployments >/dev/null 2>&1; do
    sleep 2
  done

  kubectl -n "$namespace" wait --timeout=600s --for=condition=available deployment --all || true
}

# --- 6. Install Operator Lifecycle Manager (if not already installed) ---
echo ""
echo "==> Checking Operator Lifecycle Manager..."
if ! operator-sdk olm status >/dev/null 2>&1; then
    echo "Installing OLM..."
    operator-sdk olm install --timeout 10m
    # Wait for OLM to be ready
    until operator-sdk olm status >/dev/null 2>&1; do
        echo "Waiting for OLM to be ready..."
        sleep 5
    done
    echo "✅ OLM installed successfully"
else
    echo "✅ OLM is already installed"
fi

# --- 7. Installing Namespaces ---
echo ""
echo "==> Installing Namespaces..."
kubectl apply -f manifests/common/namespaces.yaml

# --- Installing Secrets ---
echo ""
echo "==> Installing Secrets..."
# TODO: add SOPS plugin for ArgoCD to automate decrypting secrets
sops --decrypt manifests/environments/osaan-dev/secrets.enc.yaml | kubectl apply -f -

# --- Ensure correct istioctl version ---
ensure_istioctl() {
  local bin_dir="${HOME}/.osaan/istio-${ISTIO_VERSION}/bin"
  if [[ -x "${bin_dir}/istioctl" ]]; then
    echo "✅ istioctl ${ISTIO_VERSION} already installed"
    export PATH="${bin_dir}:${PATH}"
    return
  fi
  echo "==> Downloading istioctl ${ISTIO_VERSION} to ${HOME}/.osaan/..."
  mkdir -p "${HOME}/.osaan"
  # Run in a subshell so the download extracts into ~/.osaan, not the project dir
  (cd "${HOME}/.osaan" && curl -sL https://istio.io/downloadIstio | ISTIO_VERSION="${ISTIO_VERSION}" TARGET_ARCH="$(uname -m)" sh -)
  export PATH="${bin_dir}:${PATH}"
  echo "✅ istioctl ${ISTIO_VERSION} ready"
}
ensure_istioctl

# --- Installing Istio ---
echo ""
echo "==> Installing Istio ${ISTIO_VERSION}..."
istioctl install -y -n istio-system \
  --set meshConfig.accessLogFile=/dev/stdout \
  --set meshConfig.accessLogEncoding=JSON \
  --set meshConfig.enableTracing=true \
  --set meshConfig.defaultConfig.tracing.sampling=100 \
  --set profile=default \
  --set meshConfig.defaultConfig.proxyMetadata.ISTIO_META_DNS_CAPTURE=true
wait_for_deployments "istio-system"

# --- Installing Istio integrations ---
echo ""
echo "==> Installing Istio integrations (Kiali, Jaeger, Prometheus, Grafana)..."
base_url="https://raw.githubusercontent.com/istio/istio/${ISTIO_VERSION}/samples/addons"
kubectl apply -n istio-system -f "${base_url}/kiali.yaml"
kubectl apply -n istio-system -f "${base_url}/jaeger.yaml"
kubectl apply -n istio-system -f "${base_url}/prometheus.yaml"
kubectl apply -n istio-system -f "${base_url}/grafana.yaml"
wait_for_deployments "istio-system"

# --- Installing cert-manager ---
echo ""
echo "==> Installing cert-manager ${CERT_MANAGER_VERSION}..."
kubectl apply -f "https://github.com/cert-manager/cert-manager/releases/download/${CERT_MANAGER_VERSION}/cert-manager.yaml"
wait_for_deployments "cert-manager"

# --- Installing Keycloak ---
echo ""
echo "=== Installing Keycloak ${KEYCLOAK_VERSION}..."
kubectl apply -f "https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/${KEYCLOAK_VERSION}/kubernetes/keycloaks.k8s.keycloak.org-v1.yml"
kubectl apply -f "https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/${KEYCLOAK_VERSION}/kubernetes/keycloakrealmimports.k8s.keycloak.org-v1.yml"
kubectl -n keycloak apply -f "https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/${KEYCLOAK_VERSION}/kubernetes/kubernetes.yml"
wait_for_deployments "keycloak"

# --- Installing Postgres Operator ---
echo ""
echo "=== Installing CrunchyData Postgres Operator ..."
kubectl apply -f https://operatorhub.io/install/postgresql.yaml
echo "⏳ Waiting for PostgresCluster CRD to be registered..."
until kubectl get crd postgresclusters.postgres-operator.crunchydata.com >/dev/null 2>&1; do
  sleep 5
done
echo "✅ PostgresCluster CRD registered"

# --- Installing RabbitMQ Operator ---
echo ""
echo "=== Installing RabbitMQ Operator ..."
kubectl apply -f https://operatorhub.io/install/rabbitmq-cluster-operator.yaml
wait_for_deployments "operators"

# --- Installing ArgoCD ---
echo ""
echo "=== Installing ArgoCD ${ARGOCD_VERSION}..."
kubectl apply -n argocd --server-side -f "https://raw.githubusercontent.com/argoproj/argo-cd/${ARGOCD_VERSION}/manifests/install.yaml"

#echo "==> Configuring ArgoCD server to run in insecure mode (behind TLS ingress)..."
kubectl -n argocd patch configmap argocd-cmd-params-cm \
  --type merge \
  -p '{"data":{"server.insecure":"true"}}'

echo "⏳ Waiting for ArgoCD secrets to be created..."
until kubectl -n argocd get secret argocd-secret >/dev/null 2>&1; do
  sleep 2
done
until kubectl -n argocd get secret argocd-initial-admin-secret >/dev/null 2>&1; do
  sleep 2
done

ARGOCD_ADMIN_PASSWORD="$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d)"
ARGOCD_ADMIN_PASSWORD_BCRYPT="$(docker run --rm httpd:2.4-alpine htpasswd -Bbn admin "${ARGOCD_ADMIN_PASSWORD}" | cut -d ':' -f 2)"
ARGOCD_ADMIN_PASSWORD_BCRYPT="${ARGOCD_ADMIN_PASSWORD_BCRYPT/\$2y\$/\$2a\$}"
ARGOCD_ADMIN_PASSWORD_MTIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

kubectl -n argocd patch secret argocd-secret \
  --type merge \
  -p "{\"stringData\":{\"admin.password\":\"${ARGOCD_ADMIN_PASSWORD_BCRYPT}\",\"admin.passwordMtime\":\"${ARGOCD_ADMIN_PASSWORD_MTIME}\"}}"

kubectl -n argocd rollout restart deployment argocd-server
kubectl -n argocd rollout status deployment argocd-server
wait_for_deployments "argocd"

# --- Installing ArgoCD Image Updater ---
echo ""
echo "=== Installing ArgoCD Image Updater..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj-labs/argocd-image-updater/stable/config/install.yaml
wait_for_deployments "argocd"

# Create git write-back credentials for Image Updater (v1.2.0+).
# Requires GITHUB_USERNAME and GITHUB_TOKEN env vars.
if [ -z "${GITHUB_USERNAME:-}" ] || [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "⚠️  GITHUB_USERNAME or GITHUB_TOKEN is not set — Image Updater cannot write back image tags."
  echo "   Set both and run:"
  echo "   kubectl create secret generic argocd-image-updater-secret \\"
  echo "     --from-literal=username=\$GITHUB_USERNAME \\"
  echo "     --from-literal=password=\$GITHUB_TOKEN \\"
  echo "     -n argocd"
else
  kubectl create secret generic argocd-image-updater-secret \
    --from-literal=username="${GITHUB_USERNAME}" \
    --from-literal=password="${GITHUB_TOKEN}" \
    -n argocd \
    --dry-run=client -o yaml | kubectl apply -f -
  echo "✅ ArgoCD Image Updater git credentials configured"
fi

# Create Docker Hub credentials for Image Updater registry polling.
# Requires DOCKERHUB_USERNAME and DOCKERHUB_TOKEN env vars.
if [ -z "${DOCKERHUB_USERNAME:-}" ] || [ -z "${DOCKERHUB_TOKEN:-}" ]; then
  echo "⚠️  DOCKERHUB_USERNAME or DOCKERHUB_TOKEN is not set — Image Updater will poll Docker Hub anonymously (rate-limited)."
else
  kubectl create secret generic argocd-image-updater-dockerhub \
    --from-literal=credentials="${DOCKERHUB_USERNAME}:${DOCKERHUB_TOKEN}" \
    -n argocd \
    --dry-run=client -o yaml | kubectl apply -f -

  kubectl -n argocd patch configmap argocd-image-updater-config \
    --type merge \
    -p '{
      "data": {
        "registries.conf": "registries:\n- name: Docker Hub\n  prefix: docker.io\n  api_url: https://registry-1.docker.io\n  credentials: secret:argocd/argocd-image-updater-dockerhub#credentials\n  defaultns: library\n  default: true\n"
      }
    }'
  echo "✅ ArgoCD Image Updater Docker Hub credentials configured"
fi

# --- Installing External Secrets ---
echo ""
echo "=== Installing External Secrets ${EXTERNAL_SECRETS_CHART_VERSION}..."
helm repo add external-secrets https://charts.external-secrets.io >/dev/null 2>&1
helm repo update >/dev/null 2>&1
helm upgrade --install external-secrets \
   external-secrets/external-secrets \
   --version "${EXTERNAL_SECRETS_CHART_VERSION}" \
    -n external-secrets \
    --create-namespace
wait_for_deployments "external-secrets"

# --- Creating Keycloak truststore Secret for osaan-dev ---
echo "=== Creating Keycloak truststore Secret for osaan-dev ..."

TRUSTSTORE_PATH="${HOME}/.osaan/keycloak-truststore-k3d.jks"
mkdir -p "${HOME}/.osaan"
rm -f "${TRUSTSTORE_PATH}"

# Wait for ca-cert resource to be created by ArgoCD
echo "⏳ Waiting for Certificate 'ca-cert' to be created..."
kubectl apply -f manifests/platform/certificate/selfsigned-issuer.yaml
wait_attempts=0
while ! kubectl -n cert-manager get certificate ca-cert >/dev/null 2>&1; do
  wait_attempts=$((wait_attempts + 1))
  if [ "$wait_attempts" -ge 150 ]; then
    echo "❌ Timed out waiting for Certificate 'ca-cert' to be created"
    kubectl -n cert-manager get certificate ca-cert -o yaml || true
    kubectl -n cert-manager get certificates || true
    exit 1
  fi
  sleep 2
done

kubectl -n cert-manager wait certificate/ca-cert \
  --for=condition=Ready --timeout=120s

kubectl -n cert-manager get secret ca-secret \
  -o jsonpath='{.data.tls\.crt}' | base64 -d \
  | keytool -importcert \
      -alias osaan-ca \
      -keystore "${TRUSTSTORE_PATH}" \
      -storepass changeit \
      -noprompt \
      -file /dev/stdin

kubectl -n osaan-dev create secret generic keycloak-truststore \
  --from-file=keycloak-truststore.jks="${TRUSTSTORE_PATH}" \
  --dry-run=client -o yaml | kubectl apply -f -

# --- Installing Testkube ---
echo ""
echo "=== Installing Testkube..."
testkube init standalone-agent --namespace testkube --no-confirm

# --- Deploying ArgoCD app-of-apps ---
echo ""
echo "=== Deploying ArgoCD app-of-apps ..."
kubectl apply -f argocd/app-of-apps.yaml

echo ""
echo "===================================================="
echo "✅ Cluster '${CLUSTER_NAME}' setup completed successfully!"
echo "===================================================="

kubectl get pods -A
