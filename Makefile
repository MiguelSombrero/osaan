SERVICES = osaan-core employee-service skill-catalog-service competence-profile-service competence-matching-service

.PHONY: verify verify-changed install-hooks setup-cluster delete-cluster cluster-status build-services up up-no-build down clean restart

# The local gate, the same checks CI runs on every pull request.
# make verify COMPONENTS=osaan-ui,e2e  runs only those components.
verify:
	@node scripts/verify.mjs $(if $(COMPONENTS),--only $(COMPONENTS),)

# Only the components that differ from BASE (default origin/dev), as the pre-push hook does.
verify-changed:
	@node scripts/verify.mjs --changed $(or $(BASE),origin/dev)

install-hooks:
	git config core.hooksPath scripts/hooks
	@echo "pre-push now runs make verify-changed"

setup-cluster:
	@echo "Setting up the cluster..."
	./setup-cluster.sh

delete-cluster:
	@echo "Deleting the cluster..."
	k3d cluster delete osaan-dev

cluster-status:
	@node scripts/cluster-status.mjs

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

clean:
	docker compose down -v

restart: down up