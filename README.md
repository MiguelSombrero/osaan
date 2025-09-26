# osaan

Knowledge management system

## Usage

### Run in local 

```bash
docker compose build
```

```bash
docker compose up
```

### Add Skills

```bash
curl -X POST http://localhost:8092/v1/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"React"}'
```

### Add Employees

```bash
curl -X POST http://localhost:8091/v1/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john.doe@test.com"}'
```

### Add skills to employees

```bash
curl -X POST http://localhost:8093/v1/competences \
  -H "Content-Type: application/json" \
  -d '[{"employeeId":"52718fc1-2455-4994-b699-82ae5a9d4c9f","skillId":"cc8d8374-ee8f-45e7-9dea-39fa99969ac6","rating":2}]'
```

### Get employees with skill

```bash
curl -X GET http://localhost:8093/v1/competences/search?skill=Python&rating=2
```