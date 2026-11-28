---
name: implement-task
description: Implement one refined Osaan task under docs/tasks/iteration-N/ from worktree setup through verification, branch review and pull request. Invoke before writing code for a task.
---

# Implement a task

The rules are in [docs/tasks/README.md](../../../docs/tasks/README.md#how-we-work);
this orders them.

## Procedure

1. **Confirm the task is `refined` on `origin/dev`.** Fetch first. For a bare
   task number, use the roadmap's single `In progress` iteration. Ask the PO
   if this does not identify one eligible task. Its refinement PR must be
   merged first. Read the task file and everything it links.
2. **Worktree and branch.** One session, one worktree; never share a
   checkout with another session. Work on a branch
   off `origin/dev` named `iteration-N/<topic>`. At most two sessions run
   heavy work at once (a k3d cluster, `make cluster-verify`, a full
   `make verify`).
3. **Checkpoint.** Write `.claude/session-checkpoint.md` (gitignored):
   branch, base commit, task file, and the steps with done or pending.
   Update it as steps finish. On "resume where you left off", read it before
   anything else.
4. **Status `in-progress`.** Set it in the task file and the iteration table
   in the first implementation commit.
5. **Test first.** Write or strengthen the test that proves the change: one
   that fails now, or, for an upgrade, one that passes before and after it.
   Then implement. A version upgrade follows the `upgrade-component` skill.
   A new dependency the task did not name: ask the PO before adding it.
6. **Run what you changed.** The relevant suites, then `make verify`, green.
   Write long output to a file in the scratchpad and read that; piping to
   `tail` hides the command's exit code. Until iteration 0 tasks 03 and 04
   have added `make verify` and `make cluster-verify`, run each suite and
   check directly, and say so in the PR.
7. **Watch it work.** A change to anything deployable runs
   `make cluster-verify` (an ArgoCD app change also verifies with ArgoCD
   pointed at the branch). A UI change is used in a browser; a backend
   change is called on its endpoint. Report what you saw, not what you
   expected. Screenshots stay in the scratchpad, never in a commit or PR.
8. **Docs, only what matters.** Update `CLAUDE.md` or a README only if the
   change alters how something is run or tested. Add a paragraph to
   `docs/architecture.md`'s Key decisions only for a main architectural
   decision, with the alternative rejected. An unexpected failure or gotcha
   gets a row in `docs/common-failures.md` when it happens.
9. **Review.** Get a separate review of the full task diff against `origin/dev`.
   Use `/code-review` in Claude Code, `codex review --base origin/dev` in Codex,
   or the equivalent branch review in another harness. Commit the changes to
   be reviewed first so the branch comparison includes them. Fix what is worth
   fixing now. Anything bigger becomes a `needs-refinement` task file in the
   current or next iteration, with its row: never a note left in the PR.
10. **Tick the criteria by running them.** For each acceptance criterion,
    run its check and tick the box only when it passes. Then set the status
    to `done` in the file and the table, and run
    `node scripts/check-tasks.mjs`.
11. **Commit and open the PR.** Imperative summary line; the body says what
    and why and names the task. Push and open a PR to `dev` titled like the
    task, with: what changed, each acceptance criterion and what its check
    showed, and anything skipped with the reason. Never merge.
12. **Review comments are a dialogue.** Weigh each one. If you agree, change
    the code and reply with what changed. If you disagree, reply with the
    concern and an alternative, and change nothing until it is settled.
13. **Tear down after merge.** `git worktree remove <path>`, delete the
    local branch, and `git fetch --prune`.
