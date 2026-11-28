# Osaan Admin UI

Admins manage skills and employees in a React frontend backed by an Express
proxy. See the [architecture](../../docs/architecture.md) for the system layout.

## Run locally

Use Node.js 24. For frontend-only work, run these commands from
`ui/osaan-admin-ui/frontend`:

```bash
npm ci
npm run dev:mock
```

Open [localhost:5173](http://localhost:5173). MSW handles sign-in and skill
operations, including error scenarios. Edit the mock users and responses in
`src/test/mocks/data.ts` and `src/test/mocks/handlers.ts`. For example, set
`currentAuthState` to `mockRegularUser` to see the UI as a regular user.

To run against real services, start the
[shared infrastructure](../../README.md#local-infrastructure) and run
`skill-catalog-service` following the [microservice README](../../microservices/README.md#run-locally).
Run each app in a separate terminal from its own directory:

```bash
# From ui/osaan-admin-ui/backend
npm ci
npm run dev
```

```bash
# From ui/osaan-admin-ui/frontend
npm ci
npm run dev
```

Vite serves [localhost:5173](http://localhost:5173) and calls Express at
`http://localhost:3000`. Express calls the skill catalog at
`http://localhost:8092`. The development setup defaults to sign-in disabled.

## Run in Kubernetes

After [cluster setup](../../README.md#kubernetes), ArgoCD syncs the app.
Open [osaan.admin.local](https://osaan.admin.local) and sign in as `anna` with
the matching [test password](../../README.md#test-data).

## Test and build the frontend

From the repository root:

```bash
cd ui/osaan-admin-ui/frontend
npm test -- --run       # run once
npm test -- --watch     # watch mode (also npm run test:watch)
npm run lint
npm run format
npm run build
npm run preview
```

Tests live in `__tests__/` beside the code. Use Vitest and Testing Library
with `renderWithProviders()` from `src/test/utils/` and the MSW handlers
in `src/test/mocks/`. The Express backend has its own `npm test` and
`npm run lint`, run from `ui/osaan-admin-ui/backend`.

## Generate API clients

Run `npm run generate:client` from `ui/osaan-admin-ui/frontend` after
updating the [public](backend/src/openapi/skills-api.yaml) or
[admin](backend/src/openapi/admin-skills-api.yaml) OpenAPI spec. Commit the
regenerated clients. The specs are the source for API documentation.

## Publish multi-architecture images manually

Log in to Docker Hub. Run each command from `ui/osaan-admin-ui` in its own
terminal. If needed, [set up a multi-architecture builder](../../microservices/README.md#publish-a-multi-architecture-image-manually).

```bash
cd frontend
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-admin-ui-frontend:latest --push .
```

```bash
cd backend
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-admin-ui-backend:latest --push .
```
