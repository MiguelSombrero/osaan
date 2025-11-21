# Competence Profile Service

## Usage

### Add Competence (skill and rating) to employee

```bash
curl -X POST http://localhost:8093/v1/competences/b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4 \
  -H "Content-Type: application/json" \
  -d '[{"skillId":"c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8","rating":2}]'
```

### Search employees with skill and rating

```bash
curl -X GET http://localhost:8093/v1/competences/search?skill=Python&rating=2
```

## For developer

### Build and push multi-arch image

Requires login to Docker Hub. Run command in todo-app directory

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/osaan-competence-profile-service:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```