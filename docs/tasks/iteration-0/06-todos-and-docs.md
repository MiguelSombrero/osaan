# Task 06: Move TODOs into iterations and consolidate docs

- **Status:** done
- **Iteration:** [0](../iteration-0.md)
- **Covers:** DW-6
- **PR:** [#9](https://github.com/MiguelSombrero/osaan/pull/9)

## Why

`docs/develop.md` carries a TODO list, which is a backlog under another
name, and `README.md` still links to a "Bugs, issues and TODOs" section that
no longer exists. The roadmap rule is that every task lives in
an iteration. The docs are also spread across 14 Markdown files that overlap
(`docs/devops.md`, `docs/tests.md`, `docs/develop.md`, `CLAUDE.md` and ten
READMEs), which the documentation policy reduces.

## Scope

- Each item on the old TODO lists becomes a one-line task in iterations
  1–5, or is listed as dropped with a one-line reason in this iteration's
  closing notes. The lists are then deleted.
- `docs/architecture.md` gains a **Key decisions** section: one paragraph
  per main decision already in place (hexagonal services, BFF per UI,
  RabbitMQ events, GitOps with ArgoCD, SOPS secrets, Istio), each with the
  alternative that was rejected.
- `docs/devops.md`, `docs/tests.md` and `docs/develop.md` are folded into
  the READMEs and `docs/architecture.md`, then removed. Nothing about how to
  run or test anything is lost.
- A link check over the repository's Markdown runs in `make verify`.

## Constraints

- The documentation set is the one in the roadmap's
  [Documentation](../README.md#documentation) section.
- The five microservice READMEs merge into one `microservices/README.md`:
  shared run, test and build steps, and a table of each service's port and
  Swagger URL.
- The link check is a Node `.mjs` script ([task 01](01-agent-workflow.md)).
- Check relative file links and heading anchors in tracked, hand-maintained
  Markdown. Exclude generated Markdown, including the committed OpenAPI client
  docs under `ui/osaan-admin-ui/frontend/src/api/generated/`.
- The PO placed every old TODO item from `docs/develop.md` at refinement:

  | Old TODO | Placement |
  |---|---|
  | Subscription/id page showing matching employees | Dropped: new feature, not modernization |
  | Upgrade to TypeScript 7 | Iteration 5, task 2 |
  | Is osaan-admin-ui working in k3d? | Iteration 0 task 02; iteration 2 task 6 |
  | Draw a component diagram | Dropped: `docs/architecture.md` already has a landscape diagram |
  | Make microservices configuration better | Iteration 1, task 6 |
  | Test tracing in Docker Compose | Dropped: Compose no longer runs the apps or Zipkin ([task 05](05-compose-infra-only.md)) |
  | Zustand store for osaan-ui | Dropped: added with the first feature that needs it |
  | Library for generating API models | Iteration 3, task 6 (Orval) |
  | Log aggregation in k3d | Iteration 4, task 10 |
  | Testkube containers not created by triggers | Iteration 0 task 02; iteration 4 task 9 |
  | Refactor setup-cluster secret creation | Iteration 4, tasks 3 and 4 |
  | Lots of cool stuff in osaan-ui | Dropped: new features |
  | Toast notifications in admin UI | Dropped: new feature |
  | Change Keycloak initial admin passwords | Iteration 4, task 7 |
  | CI/CD release pipelines | Dropped: a release process around `main` may come later, with no task now |
  | Integration tests for microservices | Iteration 1, tasks 4 and 5 |
  | More e2e tests | Iteration 2 task 6; iteration 3 task 1 |
  | TestWorkflow failure notifications, Playwright report UI | Iteration 4, task 9 |

  The dropped items are listed in this iteration's closing notes.

## Open questions

**None.**

## Acceptance criteria

- [x] `grep -rn "TODO" --include=*.md .` finds no TODO lists outside
      `docs/tasks/`
- [x] The link check in `make verify` fails on a broken relative link or
      heading anchor in hand-maintained Markdown and passes when the only
      broken link is in generated output
- [x] Every command in the removed docs appears in a README or
      `CLAUDE.md`
