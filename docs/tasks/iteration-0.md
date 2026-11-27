# Iteration 0 — Baseline and harness

Goal: the whole stack comes up from scratch in k3d, and any change can be
verified locally, in CI on its pull request, and in the cluster — before any
version is upgraded.

## Done when

- **DW-1:** The `refine-iteration`, `implement-task` and `upgrade-component`
  skills exist, and `node scripts/check-tasks.mjs` passes on `docs/tasks/`.
- **DW-2:** On a machine with no Osaan cluster, `make setup-cluster` brings up
  `k3d-osaan-dev` unattended; every ArgoCD application is Synced and Healthy,
  and the `cluster-smoke` and `osaan-ui-e2e` Testkube workflows pass.
- **DW-3:** `make verify` runs the tests, lint, type-check and build of every
  component, and the same checks run on every pull request to `dev`; a PR with
  a failing test is red.
- **DW-4:** `make cluster-verify` deploys a branch's locally built images to
  k3d, runs the Testkube workflows against them, and leaves ArgoCD auto-sync
  on afterwards, also when a step fails.
- **DW-5:** Docker Compose runs only shared infrastructure, at the same
  versions as k3d, and each microservice starts against it with the `local`
  profile.
- **DW-6:** No TODO list remains outside `docs/tasks/`: each old item is a
  task in iterations 1–5 or recorded as dropped.

## Tasks

| ID | Task | Status |
|---|---|---|
| [01](iteration-0/01-agent-workflow.md) | Light agent workflow: skills, task checker, CLAUDE.md | done |
| [02](iteration-0/02-stack-runs-from-scratch.md) | Stack runs from scratch in k3d | done |
| [03](iteration-0/03-verify-gate-and-pr-ci.md) | `make verify` and pull-request CI | done |
| [04](iteration-0/04-cluster-verify.md) | `make cluster-verify` with local images | in-progress |
| [05](iteration-0/05-compose-infra-only.md) | Docker Compose runs shared infrastructure only | refined |
| [06](iteration-0/06-todos-and-docs.md) | Move TODOs into iterations and consolidate docs | refined |

01 goes first: it creates the skills and checker the other tasks are run
with. 02 comes next, because 03–05 are verified against a running stack.
