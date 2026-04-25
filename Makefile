SERVICES = employee-service skill-catalog-service competence-profile-service competence-matching-service

.PHONY: build-services up up-no-build down

build-services:
	@for svc in $(SERVICES); do \
		echo "Building $$svc..."; \
		cd microservices/$$svc && mvn -B clean package -DskipTests && cd ../..; \
	done

up: build-services
	docker compose up -d --build

up-no-build:
	docker compose up -d

down:
	docker compose down