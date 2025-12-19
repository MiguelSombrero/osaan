# Skill Catalog Service

## Usage

When running locally see OpenAPI documentation at: http://localhost:8092/swagger-ui/index.html

## For developer

### Build and push multi-arch image

Requires login to Docker Hub. Run command in todo-app directory

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-skill-catalog-service:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```