# Iteration 5 — Toolchain

Goal: every part runs on the current Node LTS and TypeScript, CI is pinned
and current, and dependency updates arrive automatically so Osaan stays
modern without another catch-up project.

## Done when

Written at refinement.

## Tasks

Planned, one line each. Task files are written when this iteration is
refined.

1. **Node 24 → 26 (LTS)** in Dockerfiles, CI and a root `.node-version`.
2. **TypeScript 5 → 7** in both UIs and `e2e/` (old TODO), with
   typescript-eslint support checked first.
3. **Playwright 1.57 → current** and the Testkube runner image to match.
4. **GitHub Actions** to current majors, pinned to commit SHAs, with a
   check in `make verify` that fails on an unpinned action.
5. **Automated dependency updates:** Renovate or Dependabot, grouped per
   component so one PR runs one `make verify`. Configured last, so it
   does not compete with the manual upgrades above.
