# Competence Profile Service

## Usage

### Add skill

```bash
curl -X POST http://localhost:8093/v1/competences/7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9 \
  -H "Content-Type: application/json" \
  -d '[{"skillId":"d7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a","rating":4}]'
```

### Search employees with skill and rating

```bash
curl -X GET http://localhost:8093/v1/competences/search?skill=Python&rating=4
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