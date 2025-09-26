# Competence Profile Service

## Usage

### Add skill

```bash
curl -X POST http://localhost:8093/v1/competences -H "Content-Type: application/json" -d '[{"employeeId":"52718fc1-2455-4994-b699-82ae5a9d4c9f","skillId":"cc8d8374-ee8f-45e7-9dea-39fa99969ac6","rating":2}]'
```

### Get employees with skill

```bash
curl -X GET http://localhost:8093/v1/competences/search?skill=java&rating=5
```

## For developer

### Build and push multi-arch image

Requires login to Docker Hub. Run command in todo-app directory.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/competence-profile-service:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```