# osaan-admin-ui

## Generate client

# Run `npm run generate:client` to generate client from backend/openapi/skill-api.yaml

```
npm run generate:client
```

## Build and push multi-arch image

Requires login to Docker Hub. Run command in `/frontend` or `/backend` directory.

```bash
cd frontend
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-admin-ui:latest --push .
```

```bash
cd backend
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-admin-backend:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```