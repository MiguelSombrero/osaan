# osaan-admin-ui

Osaan Admin UI is for admins to manage skills and employees.

## How to develop

## Generate client

To generate client from `backend/openapi/skill-api.yaml` when skill-catalog-service API changes:

```bash
npm run generate:client
```

## Run in dev mode

To run osaan-admin-ui and osaan-admin-backend in dev-mode:

1. Start microservices `competence-matching-service` and `skill-catalog-service` with `spring.profiles.active = local`

2. Start `osaan-admin-backend` with `npm run dev`

3. Start `osaan-admin-ui` with `npm run dev`

Now Vite dev-server is serving UI from `http://localhost:5173`

## Run in Docker Compose

To run osaan-admin-ui and osaan-admin-backend in Docker:

1. Start all services with `docker compose up --build -d`

Now Nginx server is serving UI from `http://localhost:8085`

## Run in Kubernetes

## Build and push multi-arch image

Requires login to Docker Hub. Run command in `/frontend` or `/backend` directory.

```bash
cd frontend
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-admin-ui-frontend:latest --push .
```

```bash
cd backend
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-admin-ui-backend:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```
