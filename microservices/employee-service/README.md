# Employee Service

## Usage

```bash
curl -X POST http://localhost:8080/v1/employees -H "Content-Type: application/json" -d '{"firstName":"John","lastName":"Doe","email":"john.doe@test.com"}'
```

```bash
curl -X GET http://localhost:8080/v1/employees/john.doe@test.com
```

## For developer

### Build and push multi-arch image

Requires login to Docker Hub. Run command in todo-app directory.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t miguelsombrero/employee-service:latest --push .
```

If you got error "Multi-platform build is not supported for the docker driver", you need to switch `buildx` driver to
`docker-container`:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
```