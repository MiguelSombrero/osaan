# Competence Matching Service

Microservice for finding employees with certain skills and ratings.

## Usage

### Add subscription for skill and rating

```bash
curl -X POST http://localhost:8094/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"skill":"python","rating":3,"email":"anna.korhonen@example.com"}'
```

### Get all subscriptions

```bash
curl -X GET http://localhost:8094/v1/subscriptions
```

## For developer

### Build and push multi-arch image

Requires login to Docker Hub. Run command in todo-app directory.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/competence-matching-service:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```