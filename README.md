# osaan

Osaan is my hobby project for studying different aspects of fullstack development in microservice landscape.

**This project is not production ready! It is under slow development for hobby purposes.**

Osaan is a knowledge management system built on a microservice landscape. Project managers can search for employees with specific skill sets. Employees maintain competence profiles; managers can subscribe to skill-set criteria and receive email notifications when a matching profile is added; managers can add employees to teams and see easily overall competence of the team.

## Start here

- [Microservices](microservices/README.md) for local run, test and build commands.
- [Osaan Admin UI](ui/osaan-admin-ui/README.md) to manage skills and employees.
- [Osaan UI](ui/osaan-ui/README.md) for competence profiles and subscriptions.
- [End-to-end and smoke tests](e2e/README.md) for Playwright and Testkube.
- [Architecture and deployment](docs/architecture.md) and the [modernization roadmap](docs/tasks/README.md).

## Local infrastructure

From the repository root:

```bash
make up      # PostgreSQL, RabbitMQ, Keycloak, Valkey and Mailhog
make down    # stop them
make clean   # stop them and remove their data
```

The apps run on the host from an IDE or with `npm run dev`. The infrastructure
versions match k3d and `make verify` checks the pins. The services share
PostgreSQL at `localhost:5432`, database `postgres`, user `postgres`, password
`osaan_pass`.

| Management UI | Address | Development login |
|---|---|---|
| Mailhog | [localhost:8025](http://localhost:8025) | |
| RabbitMQ | [localhost:15672](http://localhost:15672) | `guest` / `guest` |
| Keycloak | [localhost:8080](http://localhost:8080) | `admin` / `admin` |

## Kubernetes

The full stack runs in k3d. Install Docker, k3d, kubectl, operator-sdk, Helm,
SOPS, and keytool. Install the Testkube CLI to run the test workflows.
Configure SOPS with the age private key for the dev secrets. If you use a
separate key file, point `SOPS_AGE_KEY_FILE` at it.

Set Docker Hub credentials for authenticated registry access. GitHub
credentials enable Image Updater write-back. The dev cluster can run the
pinned digests with write-back disabled. Replace the placeholders for any
credentials you supply, then run this from the repository root.

```bash
export DOCKERHUB_USERNAME=...
export DOCKERHUB_TOKEN=...
export GITHUB_USERNAME=...
export GITHUB_TOKEN=...

make setup-cluster
make cluster-status
```

`make setup-cluster` runs `./setup-cluster.sh` and creates the context
`k3d-osaan-dev`. Add the gateway hosts to `/etc/hosts`:

```text
127.0.0.1 osaan.admin.local osaan.local
127.0.0.1 grafana.local mail.local kiali.local prometheus.local rabbit.local jaeger.local
127.0.0.1 keycloak keycloak.local argocd.local
```

| UI | Address |
|---|---|
| Osaan | [osaan.local](https://osaan.local) |
| Osaan Admin | [osaan.admin.local](https://osaan.admin.local) |
| Keycloak | [keycloak.local](https://keycloak.local) |
| ArgoCD | [argocd.local](https://argocd.local) |
| Kiali | [kiali.local:9080](http://kiali.local:9080) |
| Grafana | [grafana.local:9080](http://grafana.local:9080) (`admin` / `admin`) |
| Jaeger | [jaeger.local:9080](http://jaeger.local:9080) |
| Prometheus | [prometheus.local:9080](http://prometheus.local:9080) |
| RabbitMQ | [rabbit.local:9080](http://rabbit.local:9080) |
| Mailhog | [mail.local:9080](http://mail.local:9080) |

### Cluster secrets

The [dev secrets](manifests/environments/osaan-dev/secrets.enc.yaml) are
encrypted with SOPS and age. In the environment directory, copy the example
to the gitignored plaintext template and fill in your values. Set
`AGE_PUBLIC_KEY` to the age recipient before encrypting.

```bash
cd manifests/environments/osaan-dev
cp secrets-template.yaml.example secrets-template.yaml
# Fill in secrets-template.yaml first.
sops encrypt \
  --age "$AGE_PUBLIC_KEY" \
  --encrypted-regex '^(stringData)$' \
  secrets-template.yaml > secrets.enc.yaml

# setup-cluster.sh applies these automatically.
# For manual use, select the k3d-osaan-dev context first.
sops --decrypt secrets.enc.yaml | kubectl apply -f -
```

### Verify

Run `make verify` from the repository root with Node.js 24, Java 25, Maven
and Docker available. It runs the local checks used in PR CI, including
link validation for tracked, hand-maintained Markdown. `make verify-changed`
checks the affected components. `make verify COMPONENTS=scripts` runs the
repository script and documentation checks.

Run `make cluster-verify` to test changed application images against k3d.
See the [e2e README](e2e/README.md) for direct Testkube and Playwright runs.

## Test data

The following AI generated users are seeded for local development. Each user's username is also their password.

### Users

| Name            | Username | Role          | Profile type        |
| --------------- | -------- | ------------- | ------------------- |
| Anna Korhonen   | `anna`   | ADMIN         | Backend generalist  |
| Mikko Virtanen  | `mikko`  | MANAGER, USER | Frontend/UX         |
| Liisa Laine     | `liisa`  | USER          | Full-stack frontend |
| Jari Mäkinen    | `jari`   | USER          | Backend senior      |
| Sari Niemi      | `sari`   | USER          | Data/analytics      |
| Aleksi Järvinen | `aleksi` | USER          | Full-stack senior   |
| Kaisa Hautamäki | `kaisa`  | USER          | Frontend specialist |
| Timo Heikkinen  | `timo`   | USER          | DevOps/platform     |
| Emilia Salonen  | `emilia` | USER          | Java backend        |
| Petri Leinonen  | `petri`  | USER          | Tech lead           |

### Competence profiles

| Employee        | Skills (rating 1–5)                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anna Korhonen   | Java·3, TypeScript·4, PostgreSQL·3, Docker·2, Agile·4, Communication·3, Leadership·2                                                                                                    |
| Mikko Virtanen  | Python·2, JavaScript·4, UX Design·5, React·4, TypeScript·3, CSS·4, HTML·5, Tailwind CSS·3, Communication·4, Mentoring·3                                                                 |
| Liisa Laine     | Java·1, Python·2, JavaScript·3, UX Design·4, React·5, TypeScript·4, CSS·5, HTML·4, Tailwind CSS·4, Jest·3, Cypress·3, Agile·4                                                           |
| Jari Mäkinen    | Java·4, Python·3, SQL·4, PostgreSQL·5, Redis·3, Docker·4, Kubernetes·3, Agile·5, Scrum·4, TDD·3, Code Review·4, Problem Solving·5                                                       |
| Sari Niemi      | Python·4, R·3, SQL·5, PostgreSQL·4, Elasticsearch·3, Docker·2, Agile·3, Communication·4, Leadership·3, Critical Thinking·5, Problem Solving·4, Adaptability·3                           |
| Aleksi Järvinen | Java·5, JavaScript·4, TypeScript·5, React·4, Node.js·3, SQL·4, PostgreSQL·3, Docker·5, Kubernetes·4, GitHub Actions·4, Agile·4, TDD·4, Code Review·3, Teamwork·4, Problem Solving·4     |
| Kaisa Hautamäki | JavaScript·5, TypeScript·4, React·5, Vue.js·3, CSS·5, HTML·5, Sass·4, Tailwind CSS·4, Jest·4, Cypress·3, Webpack·3, Vite·4, UX Design·4, Agile·3, Communication·5                       |
| Timo Heikkinen  | Java·2, Docker·5, Kubernetes·5, Helm·4, Terraform·4, Ansible·3, Jenkins·4, GitLab CI·5, GitHub Actions·4, ArgoCD·4, Prometheus·4, Grafana·4, AWS·4, Azure·3, Agile·3                    |
| Emilia Salonen  | Java·5, Kotlin·4, SQL·4, PostgreSQL·4, Redis·3, Kafka·4, RabbitMQ·3, Docker·4, Agile·4, Scrum·4, TDD·5, JUnit·5, Mockito·4, Problem Solving·5, Communication·3                          |
| Petri Leinonen  | Java·4, JavaScript·3, Python·2, TypeScript·3, SQL·4, Docker·4, Kubernetes·3, AWS·4, Agile·5, Scrum·5, Leadership·5, Mentoring·5, Code Review·5, Pair Programming·4, Critical Thinking·4 |

Java appears in 7 employees with ratings 1–5, making it especially useful for testing search and filtering scenarios.
