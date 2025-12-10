#!/usr/bin/env bash
set -euo pipefail

# This script seals secrets from the plaintext template into encrypted SealedSecrets
# The encrypted SealedSecrets can be safely committed to Git

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_FILE="${SCRIPT_DIR}/secrets-template.yaml"
OUTPUT_FILE="${SCRIPT_DIR}/sealed-secrets.yaml"

echo "===================================================="
echo "  Sealing secrets for osaan-dev environment"
echo "===================================================="

# Check if kubeseal is installed
if ! command -v kubeseal >/dev/null 2>&1; then
  echo "❌ kubeseal is not installed."
  echo "Install it with: brew install kubeseal"
  echo "Or download from: https://github.com/bitnami-labs/sealed-secrets/releases"
  exit 1
fi

# Check if template file exists
if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "❌ Template file not found: $TEMPLATE_FILE"
  echo "Please create the secrets-template.yaml file first."
  exit 1
fi

# Check if we're connected to the cluster
if ! kubectl cluster-info >/dev/null 2>&1; then
  echo "❌ Not connected to a Kubernetes cluster"
  exit 1
fi

# Check if SealedSecrets controller is running
if ! kubectl get deployment -n kube-system sealed-secrets-controller >/dev/null 2>&1; then
  echo "❌ SealedSecrets controller not found in cluster"
  echo "Please install it first by running setup-cluster.sh"
  exit 1
fi

echo "🔐 Sealing secrets..."
echo ""

# Process each secret separately and combine them
{
  echo "# This file contains encrypted SealedSecrets"
  echo "# It is SAFE to commit this file to Git"
  echo "# Generated on: $(date)"
  echo "# "
  echo "# To update secrets:"
  echo "#   1. Edit secrets-template.yaml (NOT committed to Git)"
  echo "#   2. Run: ./seal-secrets.sh"
  echo "#   3. Commit the updated sealed-secrets.yaml"
  echo ""
  
  # Process each YAML document separately using yq or awk
  # yq is more reliable, but fall back to awk if not available
  if command -v yq >/dev/null 2>&1; then
    # Use yq to split documents (most reliable)
    yq eval-all --split-exp '.metadata.name' "$TEMPLATE_FILE" 2>/dev/null
    for secret_file in *.yml; do
      if [[ -f "$secret_file" ]]; then
        kubeseal -f "$secret_file" -o yaml --controller-namespace kube-system
        rm -f "$secret_file"
      fi
    done
  else
    # Fall back to awk-based splitting (works everywhere)
    awk 'BEGIN{n=0} /^---$/{n++; next} {print > ("/tmp/seal-secret-"n".yaml")}' "$TEMPLATE_FILE"
    
    for secret_file in /tmp/seal-secret-*.yaml; do
      if [[ -f "$secret_file" ]] && [[ -s "$secret_file" ]]; then
        # Only process files that contain valid Kubernetes resources
        if grep -q "^apiVersion:" "$secret_file" 2>/dev/null; then
          kubeseal -f "$secret_file" -o yaml --controller-namespace kube-system
        fi
      fi
    done
    
    # Cleanup temp files
    rm -f /tmp/seal-secret-*.yaml
  fi
} > "$OUTPUT_FILE"

echo "✅ Secrets sealed successfully!"
echo "📝 Sealed secrets written to: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "  1. Review the sealed secrets: cat $OUTPUT_FILE"
echo "  2. Apply them to cluster: kubectl apply -f $OUTPUT_FILE"
echo "  3. Commit to Git: git add $OUTPUT_FILE && git commit -m 'Update sealed secrets'"
echo ""
echo "⚠️  IMPORTANT: Keep secrets-template.yaml PRIVATE (it's in .gitignore)"
