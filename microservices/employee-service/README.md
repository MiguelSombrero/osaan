# Employee Service

## Usage

Create employee

```bash
curl -X POST http://localhost:8091/v1/employees -H "Content-Type: application/json" -d '{"firstName":"Miika","lastName":"Somero","email":"miika@test.com"}'
```

### GET employees

```bash
curl -X GET http://localhost:8091/v1/employees?employeeIds=fe175997-9935-45ba-8904-6c84c2894043,ee7ced9d-4dd0-4b8d-889c-1f8da1350a56
```

### GET employee

```bash
curl -X GET http://localhost:8091/v1/employees/edd06b3a-ae13-41f8-9db3-4a15b7b743d4
```

### GET employee 404 Not Found

```bash
curl -X GET http://localhost:8080/v1/employees/eaaaaaaa-ae13-41f8-9db3-4a15b7b743d4
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