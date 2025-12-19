#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="k3d-osaan-dev"
EXPECTED_CONTEXT="k3d-${CLUSTER_NAME}"
BACKUP_DIR="${HOME}/.osaan/backup"

echo "===================================================="
echo "  Setting up local Kubernetes cluster: ${CLUSTER_NAME}"
echo "===================================================="

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

# --- 5. Install Operator Lifecycle Manager (if not already installed) ---
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

# --- 6. Installing Secrets ---
echo ""
echo "==> Installing Secrets..."
# TODO: add SOPS plugin for ArgoCD to automate decrypting secrets
kubectl apply -f manifests/common/namespace-osaan.yaml
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
sops --decrypt manifests/environments/osaan-dev/secrets.enc.yaml | kubectl apply -f -

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
kubectl apply -f "https://github.com/cert-manager/cert-manager/releases/download/v1.19.2/cert-manager.yaml"
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

# --- 12. Istalling Postgres Operator ---
echo ""
echo "=== Installing CrunchyData Postgres Operator ..."
kubectl apply -f https://operatorhub.io/install/postgresql.yaml

# --- 13. Installing RabbitMQ Operator ---
echo ""
echo "=== Installing RabbitMQ Operator ..."
kubectl apply -f https://operatorhub.io/install/rabbitmq-cluster-operator.yaml

# --- 14 Installing ArgoCD ---
echo ""
echo "==> Installing ArgoCD..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

#echo "==> Configuring ArgoCD server to run in insecure mode (behind TLS ingress)..."
kubectl -n argocd patch configmap argocd-cmd-params-cm \
  --type merge \
  -p '{"data":{"server.insecure":"true"}}'

kubectl -n argocd rollout restart deployment argocd-server
kubectl -n argocd rollout status deployment argocd-server
wait_for_deployments "argocd"

# --- 15. Install External Secrets ---
echo ""
echo "=== Installing External Secrets ..."
helm repo add external-secrets https://charts.external-secrets.io >/dev/null 2>&1
helm repo update >/dev/null 2>&1
helm upgrade --install external-secrets \
   external-secrets/external-secrets \
    -n external-secrets \
    --create-namespace
wait_for_deployments "external-secrets"

# --- Creating Keycloak truststore Secret for osaan-dev ---
echo "=== Creating Keycloak truststore Secret for osaan-dev ..."

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

# --- Install Testkube non-interactively ---
echo "Installing Testkube..."
testkube init standalone-agent --namespace testkube --no-confirm

# --- 16: Deploying ArgoCD app-of-apps ---
echo ""
echo "=== Deploying ArgoCD app-of-apps ..."
kubectl apply -f argocd/app-of-apps.yaml

echo ""
echo "===================================================="
echo "✅ Cluster '${CLUSTER_NAME}' setup completed successfully!"
echo "===================================================="

kubectl get pods -A
