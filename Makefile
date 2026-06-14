SERVICES = employee-service skill-catalog-service competence-profile-service competence-matching-service

.PHONY: setup-cluster delete-cluster build-services up up-no-build down restart

setup-cluster:
	@echo "Setting up the cluster..."
	./setup-cluster.sh

delete-cluster:
	@echo "Deleting the cluster..."
	k3d cluster delete osaan-dev

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

restart: down up