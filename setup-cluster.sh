#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="k3d-osaan-dev"
EXPECTED_CONTEXT="k3d-${CLUSTER_NAME}"
REDIS_PASS=""
BACKUP_DIR="${HOME}/.osaan/backup"

echo "===================================================="
echo "  Setting up local Kubernetes cluster: ${CLUSTER_NAME}"
echo "===================================================="

# --- 0. Kysy asennuksessa tarvittavat salasanat ---
read -s -p "Give Redis password: " REDIS_PASS
echo ""
read -s -p "Give ArgoCD admin password: " ARGOCD_PASS
echo ""

# --- 1. Tarkista että k3d on asennettu ---
if ! command -v k3d >/dev/null 2>&1; then
  echo "❌ k3d is not installed. Please install it first: https://k3d.io/"
  exit 1
fi

# --- 2. Tarkista onko klusteri jo olemassa ---
if ! k3d cluster list | grep -q "${CLUSTER_NAME}"; then
  echo "==> Cluster '${CLUSTER_NAME}' not found. Creating it..."
  k3d cluster create "${CLUSTER_NAME}" \
    --api-port 6550 \
    -p '9080:80@loadbalancer' \
    -p '443:443@loadbalancer' \
    -p '9443:443@loadbalancer' \
    --volume /tmp/k3d-storage:/var/lib/rancher/k3s/storage@all \
    --agents 2 \
    --k3s-arg '--disable=traefik@server:*'
else
  echo "✅ Cluster '${CLUSTER_NAME}' already exists."
fi

# --- 3. Tarkista että ollaan oikeassa klusterissa ---
current_context=$(kubectl config current-context)
if [[ "$current_context" != "$EXPECTED_CONTEXT" ]]; then
  echo "❌ Current kubectl context is '$current_context'."
  echo "Please switch to the expected context '$EXPECTED_CONTEXT' before running this script:"
  echo "   kubectl config use-context $EXPECTED_CONTEXT"
  exit 1
else
  echo "✅ kubectl is using the correct context: $current_context"
fi

# --- 4. Odota että klusteri on käyttövalmis ---
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


# --- 5. RabbitMQ Operator ---
echo ""
echo "==> Installing RabbitMQ Cluster Operator..."
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
wait_for_deployments "rabbitmq-system"

# --- 6. Sealed Secrets ---
echo ""
echo "==> Installing SealedSecrets Operator..."
kubectl apply -f manifests/common/namespace-osaan.yaml

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Restore existing key if available (allows decrypting existing SealedSecrets)
if [[ -f "$BACKUP_DIR/sealed-secrets-key.yaml" ]]; then
  # Check if the sealed-secrets key already exists in the cluster
  if kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key=active >/dev/null 2>&1; then
    echo "✅ SealedSecrets key already exists in cluster"
  else
    echo "📦 Restoring SealedSecrets key from backup..."
    kubectl create namespace kube-system --dry-run=client -o yaml | kubectl apply -f - >/dev/null 2>&1 || true
    kubectl apply -f "$BACKUP_DIR/sealed-secrets-key.yaml"
    echo "✅ SealedSecrets key restored"
  fi
fi

# Install the controller
kubectl apply -f "https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.32.2/controller.yaml"
wait_for_deployments "kube-system"

# Backup the key if we don't have it yet
if [[ ! -f "$BACKUP_DIR/sealed-secrets-key.yaml" ]]; then
  echo "💾 Backing up SealedSecrets key for future cluster recreations..."
  # Wait a bit for the key to be generated
  sleep 5
  kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key=active \
    -o yaml > "$BACKUP_DIR/sealed-secrets-key.yaml"
  echo "✅ SealedSecrets key backed up to: $BACKUP_DIR/sealed-secrets-key.yaml"
  echo "⚠️  Keep this file safe! It's needed to decrypt your secrets."
fi

# Auto-seal secrets if template exists
# This ensures secrets are always encrypted with the CURRENT cluster's key
SECRETS_DIR="manifests/environments/osaan-dev"
TEMPLATE_FILE="$SECRETS_DIR/secrets-template.yaml"
SEALED_FILE="$SECRETS_DIR/sealed-secrets.yaml"

if [[ -f "$TEMPLATE_FILE" ]]; then
  echo ""
  echo "📋 Found secrets template: $TEMPLATE_FILE"
  
  # Check if we need to seal (template exists and is newer than sealed file, or sealed doesn't exist)
  if [[ ! -f "$SEALED_FILE" ]] || [[ "$TEMPLATE_FILE" -nt "$SEALED_FILE" ]]; then
    echo "🔐 Auto-sealing secrets with current cluster's key..."
    if [[ -x "$SECRETS_DIR/seal-secrets.sh" ]]; then
      (cd "$SECRETS_DIR" && ./seal-secrets.sh)
      echo "✅ Secrets sealed and ready to apply"
    else
      echo "⚠️  WARNING: seal-secrets.sh not found or not executable"
      echo "   You'll need to run it manually: cd $SECRETS_DIR && ./seal-secrets.sh"
    fi
  else
    echo "✅ Sealed secrets are up to date"
  fi
else
  echo ""
  echo "ℹ️  No secrets template found at $TEMPLATE_FILE"
  echo "   Create one to enable automatic secret sealing"
fi

if [[ -f "manifests/environments/osaan-dev/sealed-secrets.yaml" ]]; then
  echo "📦 Applying SealedSecrets for osaan-dev..."
  kubectl apply -f manifests/environments/osaan-dev/sealed-secrets.yaml
  echo "✅ Secrets decrypted and created in cluster"
else
  echo "⚠️  WARNING: manifests/environments/osaan-dev/sealed-secrets.yaml not found!"
  echo "   This should have been created during SealedSecrets setup above."
  echo "   Check that secrets-template.yaml exists and seal-secrets.sh is executable."
  exit 1
fi

# --- 7. Istio ---
echo ""
echo "==> Installing Istio..."
kubectl create namespace istio-system --dry-run=client -o yaml | kubectl apply -f -
istioctl install -y -n istio-system \
  --set meshConfig.accessLogFile=/dev/stdout \
  --set meshConfig.accessLogEncoding=JSON \
  --set meshConfig.enableTracing=true \
  --set meshConfig.defaultConfig.tracing.sampling=100 \
  --set profile=default \
  --set meshConfig.defaultConfig.proxyMetadata.ISTIO_META_DNS_CAPTURE=true
wait_for_deployments "istio-system"

# --- 8. Istio integrations ---
echo ""
echo "==> Installing Istio integrations (Kiali, Jaeger, Prometheus, Grafana)..."
istio_version=$(istioctl version --short --remote=false | awk '{print $3}')
echo "Detected Istio version: ${istio_version}"
base_url="https://raw.githubusercontent.com/istio/istio/${istio_version}/samples/addons"
kubectl apply -n istio-system -f "${base_url}/kiali.yaml"
kubectl apply -n istio-system -f "${base_url}/jaeger.yaml"
kubectl apply -n istio-system -f "${base_url}/prometheus.yaml"
kubectl apply -n istio-system -f "${base_url}/grafana.yaml"
wait_for_deployments "istio-system"

# --- 9. cert-manager ---
echo ""
echo "==> Installing cert-manager..."
kubectl apply -f "https://github.com/cert-manager/cert-manager/releases/download/v1.19.0/cert-manager.yaml"
wait_for_deployments "cert-manager"

# --- 10. Redis ---
echo ""
echo "=== 🧰 Installing Redis (Bitnami)..."
helm repo add bitnami https://charts.bitnami.com/bitnami >/dev/null 2>&1
helm repo update >/dev/null 2>&1
helm upgrade --install redis bitnami/redis \
  --namespace osaan-dev \
  --set architecture=standalone \
  --set auth.enabled=true \
  --set auth.existingSecret=redis-secret \
  --set master.service.ports.redis=6379 \
  --wait

# --- 11. Keycloak ---
echo ""
echo "=== Installing Keycloak ..."
kubectl create namespace keycloak --dry-run=client -o yaml \
  | kubectl label --local -f - istio-injection=enabled -o yaml \
  | kubectl apply -f -
kubectl apply -f https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/26.4.2/kubernetes/keycloaks.k8s.keycloak.org-v1.yml
kubectl apply -f https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/26.4.2/kubernetes/keycloakrealmimports.k8s.keycloak.org-v1.yml
kubectl -n keycloak apply -f https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/26.4.2/kubernetes/kubernetes.yml
wait_for_deployments "keycloak"

# --- 12. Postgres Operator and cluster ---
echo ""
echo "=== Installing CrunchyData Postgres Operator ..."
kubectl create namespace postgres-operator --dry-run=client -o yaml | kubectl apply -f -
kubectl apply --server-side -k "https://github.com/CrunchyData/postgres-operator-examples.git/kustomize/install/default"
wait_for_deployments "postgres-operator"

# --- 13 Installing ArgoCD ---
echo ""
echo "==> Installing ArgoCD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
wait_for_deployments "argocd"

# Set the initial admin password using the provided password
echo "==> Setting ArgoCD initial admin password..."
password_hash=$(docker run --rm httpd:alpine htpasswd -Bnb admin "$ARGOCD_PASS" | cut -d ":" -f 2)

# Patch argocd-secret
kubectl -n argocd patch secret argocd-secret \
  -p "{\"stringData\": { \"admin.password\": \"$password_hash\", \"admin.passwordMtime\": \"$(date +%FT%T%Z)\" }}"

# Delete the initial admin secret as it is no longer needed and might be confusing
kubectl -n argocd delete secret argocd-initial-admin-secret --ignore-not-found=true

echo "==> Configuring ArgoCD server to run in insecure mode (behind TLS ingress)..."
kubectl -n argocd patch configmap argocd-cmd-params-cm \
  --type merge \
  -p '{"data":{"server.insecure":"true"}}'

kubectl -n argocd rollout restart deployment argocd-server
kubectl -n argocd rollout status deployment argocd-server

# --- 14. Install External Secrets ---
echo ""
echo "=== Installing External Secrets ..."
helm repo add external-secrets https://charts.external-secrets.io >/dev/null 2>&1
helm repo update >/dev/null 2>&1
helm upgrade --install external-secrets \
   external-secrets/external-secrets \
    -n external-secrets \
    --create-namespace
wait_for_deployments "external-secrets"

# --- 15: Deploying platform specific resources ---
kubectl apply -f manifests/platform/argocd/argocd-platform.yaml
wait_for_deployments "keycloak"
wait_for_deployments "istio-system"
wait_for_deployments "postgres-operator"
wait_for_deployments "external-secrets"
wait_for_deployments "cert-manager"

# --- FINALLY: Creating Keycloak truststore Secret for osaan-dev ---
echo "=== Creating Keycloak truststore Secret for osaan-dev ..."

# Wait for ca-cert resource to be created by ArgoCD
echo "⏳ Waiting for Certificate 'ca-cert' to be created..."
while ! kubectl -n cert-manager get certificate ca-cert >/dev/null 2>&1; do
  sleep 2
done

# Ensure we start fresh on each run
rm -f /tmp/keycloak-truststore-k3d.jks

kubectl -n cert-manager wait certificate/ca-cert \
  --for=condition=Ready --timeout=120s

kubectl -n cert-manager get secret ca-secret \
  -o jsonpath='{.data.tls\.crt}' | base64 -d \
  | keytool -importcert \
      -alias osaan-ca \
      -keystore /tmp/keycloak-truststore-k3d.jks \
      -storepass changeit \
      -noprompt \
      -file /dev/stdin

kubectl -n osaan-dev create secret generic keycloak-truststore \
  --from-file=keycloak-truststore.jks=/tmp/keycloak-truststore-k3d.jks \
  --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "===================================================="
echo "✅ Cluster '${CLUSTER_NAME}' setup completed successfully!"
echo "===================================================="

kubectl get pods -A
