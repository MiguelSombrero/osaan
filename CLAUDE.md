# CLAUDE.md

Guidance for agents working in this repository. Loaded every session, so
keep it under 150 lines. Conventions for one part of the stack live in that
subtree's own `CLAUDE.md` (`microservices/`, `ui/osaan-admin-ui/`,
`ui/osaan-ui/`), which loads when you touch files there.

## Project

**Osaan** is a knowledge management system on a microservice landscape:
project managers find employees with a given skill set, employees keep
competence profiles, and managers subscribe to skill criteria and get an
email when a matching profile appears. A hobby and study project.

It is in a **modernization project**: every part is brought to current
stable versions and current practice, one verified step at a time. The
roadmap, the workflow and the iterations are in
[docs/tasks/README.md](docs/tasks/README.md) — read it before starting work.

## How we work

The product owner (PO) decides; agents write all code and docs and advise.

- **Skills are the entry points:** `refine-iteration` before answering any
  task's open questions, `implement-task` before writing code for a task,
  `upgrade-component` whenever a version number changes.
- **Never start a task that is not `refined`**, and only the PO moves a task
  there. Record the move in its own commit, quoting the PO.
- **One task, one PR**, on a branch `iteration-N/<topic>` off up-to-date
  `dev`. Never commit directly to `dev`. Never merge; merging is the PO's.
- **One worktree per session.** Two sessions never share a checkout.
- **Every task adds or strengthens a test.** Verify by running the change,
  not only by compiling it.
- **No backlog.** A finding becomes a task in the current or next iteration,
  or is dropped with a reason when the iteration closes.
- **Docs stay light.** Update only `CLAUDE.md` files and READMEs (when how to
  run or test changes), the Key decisions in `docs/architecture.md` (main
  architectural decisions only, no ADRs), and `docs/common-failures.md`
  (every unexpected failure, when it happens).
- **Versions come from the registry, never memory.** Next.js 16, Spring Boot
  4.x and other recent releases postdate model training: read the docs
  shipped with the package or the official site for the exact version.
- **Nothing from the host machine leaves it:** no absolute home paths,
  tokens, passwords or screenshots in commits, PRs or comments.
- **On "resume where you left off"**, read `.claude/session-checkpoint.md`
  (gitignored) before exploring.
- Commit messages: imperative summary line; the body says what and why and
  names the task file.

## Repository map

| Path | What |
|---|---|
| `microservices/` | `osaan-core` (shared library) and four Spring Boot services |
| `ui/osaan-admin-ui/` | Admin UI: React SPA (`frontend/`) + Express proxy (`backend/`) |
| `ui/osaan-ui/` | User UI: Next.js App Router |
| `e2e/` | Playwright e2e and smoke tests, run in-cluster by Testkube |
| `charts/` | Helm charts for the microservices and the UIs |
| `manifests/` | Platform, gateway, Testkube and ArgoCD application manifests |
| `argocd/` | The app-of-apps root application |
| `setup-cluster.sh` | Creates the k3d cluster and installs the platform |
| `scripts/` | Repository scripts (Node `.mjs`, tested with `node:test`) |
| `docs/` | Architecture, common failures, roadmap and task files |

## Commands

```bash
node --test scripts/              # repository script tests
node scripts/check-tasks.mjs      # task files follow docs/tasks/template.md

make build-services               # mvn clean package -DskipTests for all modules
make up | down | clean | restart  # Docker Compose (up builds the JARs first)
make setup-cluster                # k3d cluster osaan-dev + platform + ArgoCD
make delete-cluster
```

Run one component's suite from the root in a subshell, for example
`(cd microservices/employee-service && mvn test)`. Component commands are in
each subtree's `CLAUDE.md` and README.

E2E (`e2e/`): there is no `npm test`; run Playwright directly.

```bash
(cd e2e && SMOKE_GW_HTTP=http://localhost:9080 SMOKE_GW_HTTPS=https://localhost:9443 \
  npx playwright test --config playwright.smoke.config.ts)
testkube run testworkflow cluster-smoke --watch
testkube run testworkflow osaan-ui-e2e --watch
```

Something failing unexpectedly? Check `docs/common-failures.md` first.

## Architecture in brief

- Services talk over REST and RabbitMQ domain events (Spring Cloud Stream).
  For simplicity they share one PostgreSQL database, `osaan-db`, in both
  Compose and k3d.
- Each UI has a backend-for-frontend: the admin UI's Express proxy, and
  osaan-ui's Next.js API routes. Keycloak (OAuth2) authenticates users of
  both UIs; sessions live in Redis/Valkey.
- k3d runs the full stack: Istio service mesh, ArgoCD (app-of-apps watching
  `dev`), Helm charts per workload, SOPS + age secrets, Testkube,
  Prometheus, Grafana, Jaeger and Kiali.
- CI (`.github/workflows/build.yml`) runs on push to `dev`, builds and pushes
  only the changed images to Docker Hub. ArgoCD Image Updater pins their
  digests in `charts/*/.argocd-source-*.yaml`.

More in [docs/architecture.md](docs/architecture.md).

## Local test data

Seeded users — **the username is also the password**. The full skill matrix
is in `docs/develop.md`.

| Username | Role |
|---|---|
| `anna` | ADMIN |
| `mikko` | MANAGER, USER |
| `liisa`, `jari`, `sari`, `aleksi`, `kaisa`, `timo`, `emilia`, `petri` | USER |

`Java` appears on 7 of the 10 profiles with ratings 1–5, the most useful
skill for exercising search and filters.
