# osaan-admin-ui

Osaan Admin UI is for Osaan admins to manage skills and employees.

## Develop

There are 4 setups for running Osaan-admin-ui in localhost:

1. Run `frontend` with `MSW` mock (no backend needed)
2. Run `frontend` with Node.js `backend` and `skill-catalog-service`
3. Run `frontend` in Docker Compose with all microservices (no authentication)
4. Run `frontend` in Kubernetes with full system landscape

### Run frontend with MSW

    cd frontend
    npm run dev:mock

Vite dev-server is serving UI from `http://localhost:5173`

### Run frontend with backend and skill-catalog-service

Start all three services:

    cd microservices/skill-catalog-service
    mvn run spring-boot:run -Dspring.profiles.active=local

    cd frontend
    npm run dev

    cd backend
    npm run dev

Vite dev-server is serving UI from `http://localhost:5173`

### Run in Docker Compose

    docker compose up --build -d

Nginx server is serving UI from `http://localhost:8085`
(Login → admin/admin for ADMIN role)
(Login → user/user for USER role)

### Run in Kubernetes

If you have created cluster with `setup-cluster.sh` script, ArgoCD will sync all the resources in `kustomization.yaml` file to the cluster.

Nginx server is serving UI from `https://osaan.admin.local:9443`
(Login → admin/admin for ADMIN role)
(Login → user/user for USER role)

## Notes and instructions

### Build and push multi-arch image

If you need to manually build and push multi-arch image, you can use following commands:

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

### Generate client

To generate client from `backend/openapi/skill-api.yaml` when skill-catalog-service API changes:

```bash
npm run generate:client
```
