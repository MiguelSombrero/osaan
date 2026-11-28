# Osaan UI

The Next.js app lets users browse skills and maintain competence profiles.
Managers can search employees and subscribe to matching skill criteria.
See the [architecture](../../docs/architecture.md) for the system layout.

## Run locally

Use Node.js 24. Start the [shared infrastructure](../../README.md#local-infrastructure)
and start the [microservices](../../microservices/README.md#run-locally)
with the `local` profile. From `ui/osaan-ui`:

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). The
[environment template](.env.local.example) has the default service URLs
and disables Keycloak and Redis for local development. Use the
[k3d stack](../../README.md#kubernetes) for sign-in and user-specific flows.
Open [osaan.local](https://osaan.local) and use one of the
[seeded accounts](../../README.md#test-data).

## Test and build

From the repository root:

```bash
cd ui/osaan-ui
npm test                   # Vitest
npm test -- --run          # run once
npm run type-check
npm run lint
npm run build
npm start
```

Vitest and Testing Library tests live in `src/**/__tests__/`. Use
`renderHook` with a real `QueryClient` and retries and cache time disabled
for custom hooks. Render client components with `renderWithProviders()`
from `src/test/` and mock HTTP with `src/test/mocks/handlers.ts`.

## Build and run a Docker image

From `ui/osaan-ui`, build the image and set the service URLs to addresses
reachable inside the container. The example uses Docker Desktop with the
microservices running on the host.

```bash
docker build -t osaan-ui .
docker run -p 3000:3000 \\
  -e SKILL_CATALOG_API_URL=http://host.docker.internal:8092 \\
  -e COMPETENCE_PROFILE_API_URL=http://host.docker.internal:8093 \\
  -e EMPLOYEE_API_URL=http://host.docker.internal:8091 \\
  -e COMPETENCE_MATCHING_API_URL=http://host.docker.internal:8094 \\
  osaan-ui
```
