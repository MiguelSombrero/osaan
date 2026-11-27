# Task 02: Stack runs from scratch in k3d

- **Status:** needs-refinement
- **Iteration:** [0](../iteration-0.md)
- **Covers:** DW-2

## Why

No Osaan cluster exists on the development machine, and the stack has not
been brought up since September 2026. Every upgrade after this is verified
against the running stack, so it has to come up reliably first — before
anything is changed on purpose.

## Scope

- `make setup-cluster` creates `k3d-osaan-dev` and installs everything
  without prompts, given the documented env vars and the SOPS age key.
- Whatever no longer works is fixed in place, with the smallest change:
  moved or deleted upstream URLs, images that no longer pull, versions that
  no longer install together. No upgrades beyond what a fix needs.
- The known-broken Testkube triggers (`docs/develop.md`) are fixed or the
  workflows are run on demand only, whichever is smaller.
- `make cluster-status` prints each ArgoCD application's sync and health
  status and exits non-zero unless all are Synced and Healthy.
- Each failure found is a row in `docs/common-failures.md`.

## Constraints

- No restructuring: Helm layout, ArgoCD apps, OLM and secrets handling stay
  as they are. Their redesign is iteration 4.
- The machine has 16 GB for Docker. If the full stack does not fit, record
  the measured usage and propose what to make optional — do not cut silently.
- ArgoCD deploys from GitHub `dev`, so this task's fixes are verified with
  ArgoCD pointed at the branch (the exception in the roadmap's step 5).
- The cluster stays `osaan-dev` (context `k3d-osaan-dev`).
- Image Updater write-back stays off until iteration 4: `GITHUB_TOKEN` is
  not set, the script already continues without it, and the cluster runs the
  image digests pinned in the repo. Docker Hub credentials are set.
- The `/etc/hosts` entries for the gateway hosts already exist on the
  development machine.

## Open questions

**None.**

## Acceptance criteria

- [ ] `make delete-cluster; make setup-cluster` completes with no prompt and
      exit code 0 — run twice, the second time against the existing cluster
- [ ] `make cluster-status` exits 0
- [ ] `testkube run testworkflow cluster-smoke --watch` and
      `testkube run testworkflow osaan-ui-e2e --watch` both pass
- [ ] Signing in as `anna` in the admin UI and as `mikko` in osaan-ui works
      in a browser through the gateway
