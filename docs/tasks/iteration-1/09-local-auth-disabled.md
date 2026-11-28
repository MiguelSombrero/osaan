# Task 09: A local run works, signed in or not

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

A UI signed in against the Compose Keycloak fares worse. skill-catalog,
employee and competence-matching still validate a sent token while auth is
off, against the default issuer `https://keycloak.local/realms/osaan`, and
answer 500; competence-profile-service ignores the token. Seen in both UIs
for skill-catalog and competence-profile; for the other two it is read from
their security configuration.

The admin UI also has two problems of its own with sign-in on. Its backend
crashes at startup with the development default `REDIS_ENABLED=false`
(`"session.store" must be of type object`). And without a
`LOGIN_REDIRECT_URL`, which `.env.development` does not set, signing in or
out ends on `Cannot GET /` at the backend.

## Scope

- With the `local` profile, no request fails only because auth is
  disabled, whether or not it carries a token.
- The admin backend started for local development with sign-in on does not
  crash at startup.
- Signing in to and out of the admin UI run with `npm run dev` ends in the
  admin UI.

## Constraints

- The two admin UI problems belong to this task. The PO, asked on
  2026-11-28: "Yes, add them".

## Open questions

- Should a local run keep auth off and supply a stand-in user, or turn auth
  on against the Compose Keycloak? It serves plain HTTP, so setting the
  services' issuer to `http://localhost:8080/realms/osaan` may be enough
  (not tried).
- Is this its own task, or part of [task 06](06-service-configuration.md),
  which redefines the `local` profile with auth off?
- Should the admin backend keep sessions in memory when Redis is off, or
  require Redis whenever sign-in is on?

## Acceptance criteria

- [ ] A test in each affected service calls the endpoint configured as a
      local run and gets a success response, in `make verify
      COMPONENTS=competence-profile-service,competence-matching-service`
- [ ] With Compose up and the `local` profile, `GET /v1/competences` and
      `GET /v1/subscriptions` return 200
- [ ] A test starts the admin backend with sign-in on and the development
      defaults, and its sign-in and sign-out return to the frontend, in
      `make verify COMPONENTS=admin-backend`
- [ ] With Compose up, signing in to and out of the admin UI run with
      `npm run dev` ends in the admin UI
