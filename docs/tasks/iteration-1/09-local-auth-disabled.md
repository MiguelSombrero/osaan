# Task 09: User-specific endpoints work with auth disabled

- **Status:** needs-refinement
- **Iteration:** [1](../iteration-1.md)
- **Covers:** none

## Why

The `local` profile disables authentication, but some endpoints read the
user from the token. With auth off there is none, so
`GET /v1/competences` (competence-profile-service) and
`GET /v1/subscriptions` (competence-matching-service) return 500. A UI run
with `npm run dev` against local services cannot use them. Found while
running [iteration 0 task 05](../iteration-0/05-compose-infra-only.md).

## Scope

- With the `local` profile, no endpoint fails only because auth is
  disabled.

## Constraints

**None.**

## Open questions

- Should a local run keep auth off and supply a stand-in user, or turn auth
  on against the Compose Keycloak (whose self-signed certificate expired on
  2026-10-28)?
- Is this its own task, or part of [task 06](06-service-configuration.md),
  which redefines the `local` profile with auth off?

## Acceptance criteria

- [ ] A test in each affected service calls the endpoint configured as a
      local run and gets a success response, in `make verify
      COMPONENTS=competence-profile-service,competence-matching-service`
- [ ] With Compose up and the `local` profile, `GET /v1/competences` and
      `GET /v1/subscriptions` return 200
