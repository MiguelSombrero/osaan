# Task 07: Services export their OpenAPI spec

- **Status:** refined
- **Iteration:** [1](../iteration-1.md)
- **Covers:** DW-6

## Why

The admin UI generates its API client from two specs copied by hand into
`ui/osaan-admin-ui/backend/src/openapi/` (JSON in files named `.yaml`, with
the `?token=` license URL and a `localhost:8092` server baked in). Nothing
notices when skill-catalog-service changes and the copies do not.
osaan-ui has no spec at all and keeps hand-written types. Both UIs move to
Orval in iterations 2 and 3, generating from the specs this task exports.

Each service already groups its API with springdoc `GroupedOpenApi`:
skill-catalog-service `public` and `admin`, and one group in each of the
other three.

## Scope

- Every springdoc group of every service is written to a committed spec
  file in the service's directory, one file per group.
- A check in `make verify` fails when a committed spec differs from what
  the code produces, and one documented command rewrites them.
- The output is stable: the same code gives a byte-identical file on any
  machine, with no generated server URL and no port in it.
- The admin frontend's existing generator reads the exported skill-catalog
  specs; the hand-copied files in `backend/src/openapi/` are removed, and
  `scripts/verify.mjs` re-verifies the admin frontend when those specs
  change.

## Constraints

- The admin UI's move to Orval is
  [iteration 2](../iteration-2.md) task 5, and osaan-ui's is
  [iteration 3](../iteration-3.md) task 6. This task changes only the input
  path of the generator the admin UI uses today.
- Runs after [task 06](06-service-configuration.md), which fixes the
  license URL and the springdoc settings the spec is built from.
- Each service has an `*IT` that starts it with Testcontainers, reads
  `/v3/api-docs/<group>` and compares it with the committed file, so
  `./mvnw verify` (and with it `make verify`) fails on drift. A `-D` system
  property makes the same test rewrite the files. No
  `springdoc-openapi-maven-plugin`. Decided by the PO at refinement.
- The files are JSON, at `microservices/<service>/openapi/<group>.json`.

## Open questions

**None.**

## Acceptance criteria

- [ ] Each service directory holds one committed spec per springdoc group
- [ ] Adding a field to a response DTO makes `make verify
      COMPONENTS=skill-catalog-service` fail until the spec is regenerated
- [ ] Running the generate command twice leaves `git status` clean
- [ ] `make verify COMPONENTS=admin-frontend` passes, generating from the
      exported specs, and `ui/osaan-admin-ui/backend/src/openapi/` is gone
