# Task 06: Move TODOs into iterations and consolidate docs

- **Status:** needs-refinement
- **Iteration:** [0](../iteration-0.md)
- **Covers:** DW-6

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

## Open questions

- For each old TODO item: which iteration, or dropped? The agent proposes
  a placement for every item; the PO confirms or changes it.
- Do the microservice READMEs stay, one per service, or merge into one
  `microservices/README.md`?

## Acceptance criteria

- [ ] `grep -rn "TODO" --include=*.md .` finds no TODO lists outside
      `docs/tasks/`
- [ ] The link check in `make verify` passes, and fails on a broken
      relative link
- [ ] Every command in the removed docs appears in a README or
      `CLAUDE.md`
