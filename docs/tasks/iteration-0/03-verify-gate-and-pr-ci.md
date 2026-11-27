# Task 03: `make verify` and pull-request CI

- **Status:** refined
- **Iteration:** [0](../iteration-0.md)
- **Covers:** DW-3

## Why

CI only runs on pushes to `dev`, so nothing checks a pull request before it
merges. There is no single local command for "is this green". And the
baseline taken during planning shows red parts nobody noticed:

- admin UI frontend and backend: `npm run lint` fails — ESLint 9 finds no
  flat config (`.eslintrc.cjs` only)
- admin UI frontend: `npm run build` and two test files fail locally
  because the generated API client exists only after `npm run
  generate:client`, which only CI runs
- admin UI backend: `npm test` calls `jest`, which is not installed, and
  there are no tests
- employee-service has one test

## Scope

- `make verify` runs, for every component: tests, lint, type-check where
  there is one, and build. `make verify` with a component list or a
  changed-files mode runs only what a diff touched.
- The admin UI frontend builds and tests from a clean checkout, with its
  generated API clients committed.
- Lint passes for the admin UI frontend and backend with ESLint flat config.
- The admin UI backend has a working test runner and at least one test.
- A GitHub Actions workflow runs the same checks on every pull request to
  `dev`. `build.yml` keeps building and publishing on push.
- A `pre-push` hook (`make install-hooks`) runs `make verify` on what
  changed.

## Constraints

- The same command runs locally and in CI — no CI-only checks.
- No dependency upgrades except what the lint and test fixes need; those
  belong to iterations 1–3.
- Generated API clients are committed. They stay openapi-generator output
  here; the move to Orval is iteration 2. Agents may not edit them (denied
  in `.claude/settings.json`), and `make verify` fails when regenerating
  would change them.
- The PO enables branch protection on `dev` once the check exists; this
  task ends by naming the exact check to require.
- `main` is left untouched.
- Scripts are Node `.mjs` with `node:test` ([task 01](01-agent-workflow.md)).

## Open questions

**None.**

## Acceptance criteria

- [ ] `make verify` exits 0 on a clean checkout of the branch
- [ ] A commit on the branch that breaks one test makes `make verify` and
      the PR check fail; reverting it makes both pass
- [ ] `npm test` in `ui/osaan-admin-ui/backend` runs at least one test
- [ ] `npm run lint` passes in both admin UI packages
- [ ] Hand-editing a committed generated client file makes `make verify`
      fail
