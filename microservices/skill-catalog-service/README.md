# Skill Catalog Service

## Usage

### Add skill

```bash
curl -X POST http://localhost:8092/v1/skills -H "Content-Type: application/json" -d '{"name":"Python"}'
```

### GET skill
```bash
curl -X GET http://localhost:8092/v1/skills/a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5
```

### Search skill by name
```bash
curl -X GET http://localhost:8092/v1/skills?name=Python
```

## For developer

### Build and push multi-arch image

Requires login to Docker Hub. Run command in todo-app directory.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/skill-catalog-service:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```