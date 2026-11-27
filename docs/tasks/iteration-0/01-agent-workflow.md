# Task 01: Light agent workflow: skills, task checker, CLAUDE.md

- **Status:** needs-refinement
- **Iteration:** [0](../iteration-0.md)
- **Covers:** DW-1

## Why

Every later task is refined and implemented the same way, and that way only
exists as prose in [docs/tasks/README.md](../README.md). Without skills an
agent re-derives the procedure each session, and without a checker a task
file drifts from the template unnoticed. `CLAUDE.md` is 247 lines, partly
duplicated in `.cursor/rules/`, and carries detail that belongs in READMEs.

## Scope

- `.claude/skills/refine-iteration/SKILL.md` — refine one iteration (or one
  task) in one conversation: read, sweep each task for open questions, ask in
  rounds, record answers as `Constraints`, never set `refined` without the
  PO's words.
- `.claude/skills/implement-task/SKILL.md` — one `refined` task to a PR:
  worktree off fresh `dev`, session checkpoint, test first, `make verify`,
  `make cluster-verify` when the task touches anything deployable,
  `/code-review`, the doc rule from the roadmap, tick each criterion by
  running it, open the PR. Includes worktree setup and teardown.
- `.claude/skills/upgrade-component/SKILL.md` — upgrade one component: read
  release notes and migration guides for every version crossed, one major at
  a time, prove it with tests that ran before and after, log surprises in
  `docs/common-failures.md`.
- `scripts/check-tasks.mjs` with `node:test` tests: task files follow the
  template, statuses are valid, every iteration row has a file and vice
  versa with the same title and status, a `refined` task has `**None.**` open questions and at least one
  automated-test criterion.
- `docs/common-failures.md` created, with the baseline findings from
  iteration 0 planning as its first rows.
- `CLAUDE.md` cut to under 150 lines; run and test detail moves to READMEs.
- `.gitignore` covers `.claude/session-checkpoint.md`.

## Constraints

- Process rules are the ones in [docs/tasks/README.md](../README.md#how-we-work);
  the skills order them, they do not add gates.
- Docs policy is [docs/tasks/README.md](../README.md#documentation): no ADRs,
  no backlog.

## Open questions

- Is Cursor still in use? If not, `.cursor/rules/` is deleted; if yes, which
  file is the source and which is generated from it?
- Should `check-tasks.mjs` run from a Claude Code edit hook after every edit, or
  only in `make verify`?

## Acceptance criteria

- [ ] `node --test scripts/` passes, and includes a test that fails on a task
      file with a missing section and on a `refined` task with open questions
- [ ] `node scripts/check-tasks.mjs` passes on `docs/tasks/`
- [ ] `wc -l CLAUDE.md` is under 150
- [ ] The three skills are listed by Claude Code in a fresh session in this
      repository
