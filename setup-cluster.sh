#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="k3d-osaan-dev"
EXPECTED_CONTEXT="k3d-${CLUSTER_NAME}"

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
    -p '9443:443@loadbalancer' \
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
kubectl apply -f "https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.32.2/controller.yaml"
wait_for_deployments "kube-system"

# --- 7. Istio ---
echo ""
echo "==> Installing Istio..."
kubectl create namespace istio-system --dry-run=client -o yaml | kubectl apply -f -

istioctl install -y -n istio-system \
  --set meshConfig.accessLogFile=/dev/stdout \
  --set meshConfig.accessLogEncoding=JSON \
  --set meshConfig.enableTracing=true \
  --set meshConfig.defaultConfig.tracing.sampling=100 \
  --set profile=default

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

echo ""
echo "===================================================="
echo "✅ Cluster '${CLUSTER_NAME}' setup completed successfully!"
echo "===================================================="

kubectl get pods -A