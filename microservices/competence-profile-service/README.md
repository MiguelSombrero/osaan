# Competence Profile Service

## Usage

```bash
curl -X POST http://localhost:8092/v1/competences -H "Content-Type: application/json" -d '{"employeeId":"edd06b3a-ae13-41f8-9db3-4a15b7b743d4","skillId":"20c93851-7cd6-4e8a-b878-48fbf306e922","rating":4}'
```

```bash
curl -X GET http://localhost:8092/v1/skills/Python
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