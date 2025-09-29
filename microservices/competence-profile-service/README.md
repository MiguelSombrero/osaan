# Competence Profile Service

## Usage

### Add skill

```bash
curl -X POST http://localhost:8093/v1/competences/8684952d-ab2a-4536-b297-6e41bf757675 \
  -H "Content-Type: application/json" \
  -d '[{"skillId":"5411d974-52c4-493b-ad36-312838c34183","rating":2},{"skillId":"c1470b88-0454-4c15-b07f-0eb3536472e5","rating":3},{"skillId":"98a39d5f-a589-4d44-afce-163893c86f8c","rating":5}]'
```

### Search employees with skill and rating

```bash
curl -X GET http://localhost:8093/v1/competences/search?skill=Java&rating=3
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