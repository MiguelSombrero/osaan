# Iteration 4 — Platform

Goal: the k3d platform and GitOps setup follow current practice and run
current versions, with each component restructured and upgraded in one
task and verified with `make cluster-verify`.

## Done when

Written at refinement.

## Tasks

Planned, one line each. Task files are written when this iteration is
refined. Each task compares what is there against current practice first,
and the change follows from that comparison.

1. **GitOps layout.** Separate reusable charts from environment values.
   Today per-service values and Image Updater's `.argocd-source-*.yaml`
   write-backs live inside the chart directories. Put all ArgoCD
   applications in one place (now split between `argocd/` and
   `manifests/argocd-apps/`), and use an AppProject instead of `default`.
2. **Image versioning.** Immutable tags from CI instead of `latest` plus
   digest write-back, and decide whether Image Updater stays. It is the
   source of the "build: automatic update" commits on `dev`. Also remove
   the `osaan-local/*` images that `make cluster-verify` imports into the
   k3d nodes; each run adds one per app and nothing deletes them.
3. **One owner per component.** Istio is installed by `setup-cluster.sh`
   *and* managed by ArgoCD, and operators come in through OLM and
   operatorhub.io URLs. Reduce the script to bootstrap (cluster, ArgoCD,
   age key) and let ArgoCD install the rest.
4. **Secrets.** SOPS decrypted by the script and External Secrets are both
   in use; keep one mechanism.
5. **Istio 1.29 → 1.32**, one minor version at a time. Also decide on
   Kubernetes Gateway API instead of Istio `Gateway` resources.
6. **PostgreSQL operator.** CrunchyData via OLM, or CloudNativePG — decided
   at refinement.
7. **Keycloak 26.6 → 26.8**, realm import reviewed (operator
   realm import or keycloak-config-cli); Keycloak admin passwords changed (old TODO).
8. **ArgoCD 3.3 → 3.6, cert-manager 1.19 → 1.21, External Secrets, Image
   Updater, RabbitMQ operator**, each via `upgrade-component`.
9. **Testkube 2.9 → 2.16,** with the e2e workflows triggered and reported
   reliably: failure notifications and a way to view Playwright reports
   (old TODOs). The deployment-image-update TestTriggers also run dev's
   workflows on every `make cluster-verify` deploy and restore, alongside
   its own `-local` runs.
10. **Mailhog → Mailpit,** and observability charts (Prometheus, Grafana,
    Jaeger, Kiali) to current versions; decide on an OpenTelemetry
    Collector and on log aggregation (old TODO).
