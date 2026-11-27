# Task 04: `make cluster-verify` with local images

- **Status:** needs-refinement
- **Iteration:** [0](../iteration-0.md)
- **Covers:** DW-4

## Why

ArgoCD deploys only what is on GitHub `dev`, using images from Docker Hub.
So a branch can't be seen running in k3d until it has merged, and a broken
`dev` is the first signal. Iterations 1–4 change deployable code in nearly
every task and need to verify each change in the cluster before merging.

## Scope

- `make cluster-verify` (optionally `COMPONENTS=...`) does:
  1. builds the images of the changed components from the working tree
  2. imports them into `k3d-osaan-dev` (`k3d image import`)
  3. pauses ArgoCD auto-sync for the affected applications
  4. deploys the branch's chart and values for them, pointing at the local
     images
  5. waits for the rollout
  6. runs the `cluster-smoke` and `osaan-ui-e2e` Testkube workflows
  7. restores auto-sync
- Auto-sync is restored when any step fails or the run is interrupted.
- `make cluster-reset` returns every app to what `dev` declares.
- The script has automated tests for its logic: choosing components,
  ordering steps, and restoring auto-sync after a failure.

## Constraints

- Agreed in planning: local images, not ArgoCD pointed at the branch (see
  the roadmap's step 5).
- Needs a running cluster from [task 02](02-stack-runs-from-scratch.md).

## Open questions

- Script language: Node `.mjs` with `node:test` (shares a
  test runner with `check-tasks.mjs`), or Bash with `bats`?

## Acceptance criteria

- [ ] With a visible change in one service on the branch (for example, its
      `/actuator/info` version), `make cluster-verify COMPONENTS=<service>`
      exits 0 and the pod serves the changed response
- [ ] Making the smoke test fail makes `make cluster-verify` exit non-zero,
      and `kubectl -n argocd get application <service>` shows auto-sync on
      again afterwards
- [ ] The script's own tests pass in `make verify`
