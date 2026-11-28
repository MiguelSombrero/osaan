# Task file template

Two kinds of file live under `docs/tasks/`:

- **`iteration-N.md`** — the iteration: goal, `Done when`, and the task table.
- **`iteration-N/NN-slug.md`** — one task, written before the work starts.

A task file is the *request*: what is wanted, why, and how anyone can tell it
worked. It is not a record of what was built — that is the code, its tests,
and the few docs listed in [README.md](README.md#documentation).

## Iteration file

```markdown
# Iteration N — Title

Goal: one sentence — what is true afterwards that is not true now.

## Done when

- **DW-1:** an outcome that can be run and checked
- **DW-2:** …

## Tasks

| ID | Task | Status |
|---|---|---|
| [01](iteration-N/01-slug.md) | Title matching the task file's H1 | refined |
```

Iterations not yet refined list their tasks as one line each; the task files
are written when the iteration is refined.

## Task file

```markdown
# Task NN: Title

- **Status:** needs-refinement | refined | in-progress | done | dropped
- **Iteration:** [N](../iteration-N.md)
- **Covers:** DW-1
- **PR:** link, added when the PR opens

## Why

The problem, and why now. No solution here.

## Scope

What changes, as outcomes. Enough that two people agree what is in or out.

## Constraints

Decisions that bind this task, including the answers recorded at
refinement. `**None.**` is a valid answer.

## Open questions

Questions for the product owner. `**None.**` only once they are answered.

## Acceptance criteria

- [ ] Observable outcome — and the command or check that verifies it
- [ ] At least one criterion is an automated test, naming its command in
      backticks (`npm test`, `./mvnw verify`, `make verify`, …)
```

### Rules

- **Status.** A new task is `needs-refinement`. Only the product owner moves
  it to `refined`; the agent records that move in its own commit, quoting the
  product owner's words. Nothing is implemented before `refined`.
- **Refinement before implementation, in separate PRs.** An iteration's
  task files, the refinement answers and the `refined` commit go in one
  refinement PR, which is merged before any of its tasks is implemented.
  Each task is then implemented in its own PR.
- **Acceptance criteria** must each be checkable on the task's own branch,
  before merge. Prefer one that fails today.
- **Every task adds or strengthens a test** that would catch a regression in
  what it touched. An upgrade task proves the system still works with a test
  that ran before and after the upgrade.
- **No backlog.** A finding made during a task either becomes a task in the
  current or next iteration, or is dropped with a one-line reason in the
  iteration's closing notes. IDs are never reused; a dropped task keeps its
  file with status `dropped`.
- **Only these sections, in this order.** No design write-ups in a task
  file.
