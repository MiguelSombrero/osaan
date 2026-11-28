import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findProblems } from './check-compose-versions.mjs';

const FILES = {
  'manifests/platform/postgres/postgres.yaml': [
    'spec:',
    '  postgresVersion: 17',
    '  image: registry.example.com/crunchydata/crunchy-postgres:ubi9-17.2-1',
  ].join('\n'),
  'manifests/platform/rabbitmq/rabbitmq.yaml': 'spec:\n  image: rabbitmq:4.1.2-management\n',
  'setup-cluster.sh': 'KEYCLOAK_VERSION="26.0.1"       # a trailing comment\n',
  'manifests/argocd-apps/valkey-app.yaml': '      values: |\n        image:\n          tag: "9.1.0"\n',
  'manifests/platform/mail-server/mailhog.yaml': '          image: mailhog/mailhog:v1.0.1\n',
};

const SERVICES = {
  'osaan-db': { image: 'postgres:17.2-alpine' },
  rabbitmq: { image: 'rabbitmq:4.1.2-management' },
  keycloak: { image: 'quay.io/keycloak/keycloak:26.0.1' },
  'osaan-valkey': { image: 'valkey/valkey:9.1.0-alpine' },
  mailhog: { image: 'mailhog/mailhog:v1.0.1' },
};

const problems = (services = {}, files = {}) =>
  findProblems({ ...SERVICES, ...services }, (file) => ({ ...FILES, ...files })[file]);

test('Compose images that match what k3d declares pass', () => {
  assert.deepEqual(problems(), []);
});

test('each component fails when its Compose tag differs from k3d', () => {
  const stale = {
    'osaan-db': 'postgres:18.0-alpine',
    rabbitmq: 'rabbitmq:4-management',
    keycloak: 'quay.io/keycloak/keycloak:26.4',
    'osaan-valkey': 'valkey/valkey:9.0.3-alpine',
    mailhog: 'mailhog/mailhog',
  };
  for (const [name, image] of Object.entries(stale)) {
    const found = problems({ [name]: { image } });
    assert.equal(found.length, 1, name);
    assert.ok(found[0].startsWith(`${name}: image is ${image}, expected `), found[0]);
  }
});

test('a version bumped in k3d alone fails until Compose follows', () => {
  assert.match(
    problems({}, { 'setup-cluster.sh': 'KEYCLOAK_VERSION="26.1.0"\n' })[0],
    /^keycloak: .*expected quay\.io\/keycloak\/keycloak:26\.1\.0 .*setup-cluster\.sh/,
  );
});

test('a service k3d does not run is rejected, so applications stay out of Compose', () => {
  assert.match(problems({ 'employee-service': { build: {} } })[0], /^employee-service: not shared infrastructure/);
});

test('a missing infrastructure service is reported', () => {
  assert.match(problems({ mailhog: undefined })[0], /^mailhog: missing from docker-compose\.yaml/);
});

test('a k3d file that stops declaring an exact version fails rather than passing', () => {
  const untagged = { 'manifests/platform/mail-server/mailhog.yaml': '          image: mailhog/mailhog\n' };
  assert.match(problems({}, untagged)[0], /^mailhog: .*mailhog\.yaml declares no exact version/);
  const commented = { 'manifests/platform/rabbitmq/rabbitmq.yaml': '  # image: rabbitmq:4.1.2-management\n' };
  assert.match(problems({}, commented)[0], /^rabbitmq: .*declares no exact version/);
});

test('the PostgreSQL image must be the major that postgresVersion names', () => {
  const file = 'manifests/platform/postgres/postgres.yaml';
  const found = problems({}, { [file]: FILES[file].replace('postgresVersion: 17', 'postgresVersion: 18') });
  assert.match(found[0], /^osaan-db: .*postgresVersion 18.*image is 17\.2/);
});
