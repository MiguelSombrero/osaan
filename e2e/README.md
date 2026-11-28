# E2E and smoke tests

These Playwright suites run against the [k3d stack](../README.md#kubernetes).
Testkube's normal workflows use the tests on `dev`. Run `make cluster-verify`
from the repository root to test working-tree changes with local app images
and Testkube workflows.

| TestWorkflow | Coverage | Deployment update triggers |
|---|---|---|
| `cluster-smoke` | HTTP reachability of all ten gateway endpoints | `osaan-dev`, `istio-system`, `keycloak` |
| `osaan-ui-e2e` | Keycloak sign-in and the skill list in Chromium, Firefox and WebKit | `osaan-dev` |

## Run in Testkube

Use the `k3d-osaan-dev` kubectl context and the Testkube CLI.

```bash
testkube run testworkflow cluster-smoke --watch
testkube run testworkflow osaan-ui-e2e --watch
testkube get testworkflowexecution --testworkflow cluster-smoke
```

In-cluster tests reach the Istio gateway through its service DNS name.
Smoke tests set the virtual host and make HTTP requests directly, so they
need no browser (about 256 MiB). The browser workflow needs about 2 GiB.

## Run smoke tests from the host

From the repository root, with the cluster running:

```bash
cd e2e
npm ci
export SMOKE_GW_HTTP=http://localhost:9080
export SMOKE_GW_HTTPS=https://localhost
npx playwright test --config playwright.smoke.config.ts
```
