---
name: refine-iteration
description: Numbered procedure for refining an Osaan iteration (or a single task) under docs/tasks/ with the product owner — writing missing task files, sweeping every task for open questions, asking them as one agenda, recording the answers as Constraints, and recording the PO's move to refined. Invoke before answering any task's open questions or touching its Status.
---

# Refine an iteration

The rules are in [docs/tasks/README.md](../../../docs/tasks/README.md#how-we-work)
and [the template](../../../docs/tasks/template.md); this orders them. The
unit is one iteration: its tasks share vocabulary and one `Done when`, so
their questions are asked together. For a single task, run the same steps
on that task alone.

Refining writes no code. It ends in its own pull request, which the PO
merges before any of the iteration's tasks is implemented. Implementation
PRs branch off `dev` after that merge.

## Procedure

1. **Branch.** `git fetch origin`, then branch off `origin/dev` as
   `iteration-N/refinement` (`iteration-N/refine-NN` for a single task).
2. **Write the missing files.** If the iteration still lists one-line tasks,
   write `## Done when` (enumerated `DW-N` outcomes that can be run) and one
   task file per line, all `needs-refinement`, following the template. Write
   each task's `Why`, `Scope` and acceptance criteria from what the code
   does today, not from the one-liner alone.
3. **Read everything first.** The iteration file, every task file, what
   they link, and the code and config each task would touch. Check facts on
   the machine and in the repository (versions, env vars, files, what runs)
   instead of asking the PO for them.
4. **Sweep each task, unmerged.** For every task, list a question only where
   one of these surfaces something the task leaves open:
   - scope and behaviour
   - data and API contracts
   - what a user sees and reads
   - security, performance, accessibility, localization
   - integrations, external services and versions
   - edge cases and failure handling
   - trade-offs, and decisions already made elsewhere that bind it
   - how "done" is verified
5. **Check every acceptance criterion.** It must be checkable on the task's
   own branch before merge; at least one must be an automated test; prefer
   one that fails today. Reword a criterion that needs the merge or a later
   run. If rewording is a choice, it becomes an agenda item.
6. **Merge into one agenda.** Questions several tasks ask are one decision;
   note which tasks it binds. Drop questions another answer settles, and
   questions no task's `Scope` depends on. Put upstream decisions first.
7. **Ask in rounds of up to four.** Use AskUserQuestion when the choices can
   be named: recommended option first, with a trade-off in each description.
   Ask in plain text when the PO should describe rather than pick, or wants
   to discuss. After each round, re-derive: drop what an answer settled.
8. **Record the answers** as `Constraints` in every task they bind. A
   decision that binds several tasks is written once and linked from the
   others. If an answer moves work into or out of a later iteration, edit
   that iteration's one-liners in the same commit. Set `Open questions` to
   `**None.**` only once its sweep is answered.
9. **Check and commit.** `node scripts/check-tasks.mjs`, then commit:
   "Record iteration N refinement answers in its task files", listing the
   decisions in the body.
10. **Ask the PO to move tasks to `refined`.** Only on the PO's words, set
    each named task's status in its file and in the iteration's table, run
    the checker, and commit "Move iteration N tasks to refined" quoting the
    PO's words. A task with a question still open stays
    `needs-refinement`, and you say so.
11. **Open the refinement PR.** Run `make verify`, push, and open a PR to
    `dev` titled "Refine iteration N", listing the tasks, their status and
    the decisions. Never merge; implementation starts only after the PO
    has merged it.

## A refined task that has gone stale

If implementing contradicts what a `refined` task file says, stop and
re-refine that task with the PO. Do not improvise the difference. The
re-refinement is a small refinement PR of its own (`iteration-N/refine-NN`),
merged before the implementation continues on a branch rebased onto it.
