SERVICES = osaan-core employee-service skill-catalog-service competence-profile-service competence-matching-service

.PHONY: verify verify-changed install-hooks setup-cluster delete-cluster cluster-status cluster-verify cluster-reset build-services up down clean restart

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

# Deploys the working tree's changed apps to k3d with locally built images and
# runs the Testkube workflows; ArgoCD auto-sync is paused for those apps only
# and restored afterwards. COMPONENTS=employee-service,osaan-ui names the apps;
# otherwise the apps that differ from BASE (default origin/dev).
cluster-verify:
	@node scripts/cluster-verify.mjs $(if $(COMPONENTS),--only $(COMPONENTS),--changed $(or $(BASE),origin/dev))

# Returns every ArgoCD app to what GitHub dev declares, e.g. after a killed cluster-verify.
cluster-reset:
	@node scripts/cluster-verify.mjs --reset

build-services:
	@for svc in $(SERVICES); do \
		echo "Building $$svc..."; \
		cd microservices/$$svc && mvn -B clean package -DskipTests && cd ../..; \
	done

# Shared infrastructure only (PostgreSQL, RabbitMQ, Keycloak, Valkey, Mailhog),
# for IDE and `npm run dev` work. The full stack runs in k3d.
up:
	docker compose up -d

down:
	docker compose down --remove-orphans

clean:
	docker compose down -v --remove-orphans

restart: down up