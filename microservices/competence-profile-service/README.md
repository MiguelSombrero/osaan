# Competence Profile Service

## Usage

### Add Competence (skill and rating) to employee

```bash
curl -X POST http://localhost:8093/v1/competences/d8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2 \
  -H "Content-Type: application/json" \
  -d '[{"skillId":"b2bd39fa-73a9-4097-893b-00f68b8492ca","rating":4}]'
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