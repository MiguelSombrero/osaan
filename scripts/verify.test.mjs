import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COMPONENTS, needsNpmCi, parseArgs, selectComponents } from './verify.mjs';

const ALL = COMPONENTS.map((c) => c.name);
const SERVICES = ['employee-service', 'skill-catalog-service', 'competence-profile-service', 'competence-matching-service'];

test('a change inside one service selects only that service', () => {
  assert.deepEqual(selectComponents(['microservices/employee-service/src/main/java/A.java']), ['employee-service']);
});

test('a change in osaan-core selects osaan-core and every service that depends on it', () => {
  assert.deepEqual(
    selectComponents(['microservices/osaan-core/pom.xml']).sort(),
    ['osaan-core', ...SERVICES].sort(),
  );
});

test('a change to the OpenAPI specs selects both admin UI packages', () => {
  assert.deepEqual(
    selectComponents(['ui/osaan-admin-ui/backend/src/openapi/skills-api.yaml']).sort(),
    ['admin-backend', 'admin-frontend'],
  );
});

test('a change to the gate itself selects every component', () => {
  for (const file of ['Makefile', 'scripts/verify.mjs', '.github/workflows/verify.yml', '.github/workflows/build.yml']) {
    assert.deepEqual(selectComponents([file]), ALL, file);
  }
});

test('a change to the admin UI root package selects both admin UI packages', () => {
  assert.deepEqual(selectComponents(['ui/osaan-admin-ui/package.json']), ['admin-backend', 'admin-frontend']);
});

test('Markdown changes select the scripts component for the repository link check', () => {
  assert.deepEqual(selectComponents(['docs/tasks/iteration-0.md']), ['scripts']);
  assert.deepEqual(selectComponents(['README.md']), ['scripts']);
  assert.deepEqual(selectComponents(['ui/osaan-ui/README.md']), ['scripts', 'osaan-ui']);
  const scripts = COMPONENTS.find((c) => c.name === 'scripts');
  assert.ok(scripts.steps.some((step) => step.args?.includes('scripts/check-markdown-links.mjs')));
});

test('a change to Compose or to a file that declares a k3d version selects the version check', () => {
  const files = [
    'docker-compose.yaml',
    'setup-cluster.sh',
    'manifests/platform/postgres/postgres.yaml',
    'manifests/argocd-apps/valkey-app.yaml',
  ];
  for (const file of files) assert.deepEqual(selectComponents([file]), ['scripts'], file);
  const scripts = COMPONENTS.find((c) => c.name === 'scripts');
  assert.ok(scripts.steps.some((s) => s.args?.includes('scripts/check-compose-versions.mjs')));
});

test('a file no component owns selects nothing', () => {
  assert.deepEqual(selectComponents(['charts/osaan-ui/values/osaan-ui.yaml']), []);
});

test('components come back in the declared order, each once', () => {
  const selected = selectComponents(['ui/osaan-ui/src/a.ts', 'scripts/x.mjs', 'ui/osaan-ui/src/b.ts']);
  assert.deepEqual(selected, ['scripts', 'osaan-ui']);
});

test('parseArgs reads --only, --changed and --list', () => {
  assert.deepEqual(parseArgs([]), { only: null, changed: null, list: false });
  assert.deepEqual(parseArgs(['--only', 'osaan-ui,e2e']), { only: ['osaan-ui', 'e2e'], changed: null, list: false });
  assert.deepEqual(parseArgs(['--changed', 'origin/dev', '--list']), { only: null, changed: 'origin/dev', list: true });
});

test('parseArgs rejects an unknown component, an unknown flag and a missing value', () => {
  assert.throws(() => parseArgs(['--only', 'frontend']), /unknown component "frontend"/);
  assert.throws(() => parseArgs(['--fast']), /unknown argument "--fast"/);
  assert.throws(() => parseArgs(['--changed']), /--changed needs a value/);
});

test('npm ci runs in CI, with no node_modules, or when the lockfile is newer than the install', () => {
  assert.equal(needsNpmCi({ ci: true, installedAt: 200, lockfileAt: 100 }), true);
  assert.equal(needsNpmCi({ ci: false, installedAt: null, lockfileAt: 100 }), true);
  assert.equal(needsNpmCi({ ci: false, installedAt: 100, lockfileAt: 200 }), true);
  assert.equal(needsNpmCi({ ci: false, installedAt: 200, lockfileAt: 100 }), false);
});
