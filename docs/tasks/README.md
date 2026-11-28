# Osaan modernization roadmap

Osaan has been unmaintained since September 2026. This roadmap brings every
part of it — microservices, both UIs, the k3d platform, GitOps and CI — up to
current stable versions and current practice, one verified step at a time, so
that feature development can resume as agentic, spec-driven work.

**The goal is technical quality, not documentation.** Docs stay light (see
[Documentation](#documentation)); tests and working software carry the weight.

## Iterations

Foundation first: the gates every later task relies on, then one layer at a
time, low risk before high. Each platform component is restructured and
upgraded in the same task, so nothing is changed twice.

| # | Iteration | Goal | Status |
|---|---|---|---|
| 0 | [Baseline and harness](iteration-0.md) | The stack runs from scratch, and every change can be verified locally, in CI and in k3d | 🔄 In progress |
| 1 | [Backend](iteration-1.md) | Microservices on current Spring, one Maven build, every service tested like skill-catalog-service | ⬜ Todo |
| 2 | [Admin UI](iteration-2.md) | Admin UI and its backend on current React/MUI/Vite, the backend tested for the first time | ⬜ Todo |
| 3 | [User UI](iteration-3.md) | osaan-ui on current Next.js, Tailwind and auth, with e2e coverage of its main flows | ⬜ Todo |
| 4 | [Platform](iteration-4.md) | k3d platform and GitOps restructured to current practice and current versions | ⬜ Todo |
| 5 | [Toolchain](iteration-5.md) | Node 26, TypeScript 7 and pinned CI everywhere, with automation that keeps it current | ⬜ Todo |

Iterations 0 and 1 have task files. Iterations 2–5 list one-line tasks;
their task files are written when each is refined, because earlier
iterations will change what they need. Status: ⬜ Todo → 🔄 In progress → ✅ Done.

## How we work

The product owner (PO) decides; agents write all code and docs and advise.

1. **Refine an iteration** with the `refine-iteration` skill: the agent reads
   the iteration, sweeps each task for open questions, and asks them in one
   conversation. Answers become `Constraints`.
2. **Only the PO moves a task to `refined`.** The agent records that move in
   its own commit, quoting the PO's words.
3. **Refinement is its own PR**, on `iteration-N/refinement`: the task
   files, the answers and the `refined` commit, and no code. The PO merges
   it before any of its tasks is implemented, so every implementation
   starts from a task file that is already on `dev`.
4. **Implement one task per PR** with the `implement-task` skill, on a branch
   off up-to-date `dev` (`iteration-N/<topic>`), in its own worktree. The PR
   carries the code and the task's status changes.
5. **Every task adds or strengthens a test.** An upgrade task proves the
   system still works with tests that ran before and after it.
6. **Verify by running it**, at the level the task touches:
   - `make verify` — unit tests, lint, type-check and build for what changed.
     No cluster needed. Required before every push, and run by CI on every PR.
   - `make cluster-verify` — for anything deployable or deployed: builds the
     changed images locally, imports them into k3d, pauses ArgoCD auto-sync
     for those apps, deploys the branch's chart, runs the Testkube smoke and
     e2e workflows, and restores auto-sync.
   - Tasks that change the ArgoCD apps themselves also verify with ArgoCD
     pointed at the branch.
7. **Upgrades follow the `upgrade-component` skill:** read the target
   version's release notes and migration guide — never memory — upgrade one
   major at a time, and log every surprise in `docs/common-failures.md`.
8. **Revisit decisions.** Where a past choice (layout, Helm, ArgoCD, tooling)
   has a clearly better current practice, it becomes a task in an iteration.
9. **No backlog.** A finding becomes a task in the current or next iteration,
   or is dropped with a one-line reason when the iteration closes.
10. **Merging is the PO's.** Agents open PRs; they never merge.

An iteration closes when the PO has seen each `Done when` criterion run and
pass; the agent then sets its status above and writes its closing notes
(what was dropped and why) at the end of the iteration file.

## Documentation

Only these are kept up to date, and only with what really matters:

| File | Holds |
|---|---|
| `CLAUDE.md` | Rules and commands an agent needs every session; under 150 lines |
| `docs/architecture.md` | The system's shape, and a **Key decisions** section — one paragraph per main decision, with the alternative rejected. No ADRs |
| `docs/common-failures.md` | Failures and gotchas: symptom, cause, fix. One row each, added when it happens |
| `README.md` files | How to run and test each part |
| `docs/tasks/` | Iterations and task files, frozen once done |

A task updates another doc only when it changes how something is run.

## Workflow tooling

Built in [iteration 0 task 01](iteration-0/01-agent-workflow.md) and kept
deliberately small:

| Tool | Purpose |
|---|---|
| `refine-iteration` skill | Refine an iteration, or a single task, in one conversation |
| `implement-task` skill | Take one `refined` task to a PR, worktree setup and teardown included |
| `upgrade-component` skill | Upgrade one component, one major version at a time |
| `scripts/check-tasks.mjs` | Check task files against [the template](template.md), with its own tests |
| `make verify` + `pre-push` hook | The local gate, the same checks CI runs |
| `.claude/session-checkpoint.md` | Gitignored progress note, read first when resuming interrupted work |

Deliberately left out: ADRs, a backlog and per-PR gate reports.
