import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  APPS,
  buildCommands,
  ROOT_APP,
  WORKFLOWS,
  parseArgs,
  parseJsonStream,
  runClusterVerify,
  selectApps,
  trackingId,
  withTracking,
  workflowCopy,
} from './cluster-verify.mjs';

const SERVICES = ['employee-service', 'skill-catalog-service', 'competence-profile-service', 'competence-matching-service'];
const UIS = ['osaan-ui', 'osaan-admin-ui', 'osaan-admin-backend'];

// --- choosing components -----------------------------------------------------

test('a change inside one service selects that service and the tests', () => {
  assert.deepEqual(selectApps(['microservices/employee-service/src/main/resources/application.yaml']), {
    apps: ['employee-service'],
    tests: true,
  });
});

test('a change in osaan-core selects every service', () => {
  assert.deepEqual(selectApps(['microservices/osaan-core/pom.xml']).apps, SERVICES);
});

test('each UI package selects its own app', () => {
  assert.deepEqual(selectApps(['ui/osaan-ui/src/app/page.tsx']).apps, ['osaan-ui']);
  assert.deepEqual(selectApps(['ui/osaan-admin-ui/frontend/src/App.tsx']).apps, ['osaan-admin-ui']);
  assert.deepEqual(selectApps(['ui/osaan-admin-ui/backend/src/index.js']).apps, ['osaan-admin-backend']);
});

test("an app's values file selects only that app", () => {
  assert.deepEqual(selectApps(['charts/osaan-microservice/values/skill-catalog-service.yaml']).apps, [
    'skill-catalog-service',
  ]);
  assert.deepEqual(selectApps(['charts/osaan-ui/values/osaan-admin-backend.yaml']).apps, ['osaan-admin-backend']);
});

test("a change to a chart's templates or defaults selects every app on that chart", () => {
  assert.deepEqual(selectApps(['charts/osaan-microservice/templates/deployment.yaml']).apps, SERVICES);
  assert.deepEqual(selectApps(['charts/osaan-ui/values.yaml']).apps, UIS);
});

test("Image Updater's digest pins select nothing: they are what dev already runs", () => {
  assert.deepEqual(selectApps(['charts/osaan-ui/.argocd-source-osaan-ui.yaml']), { apps: [], tests: false });
});

test('a change to the e2e tests or the two workflows runs the tests without deploying anything', () => {
  for (const file of ['e2e/tests/smoke/smoke.spec.ts', 'manifests/testkube/osaan-ui-e2e.yaml']) {
    assert.deepEqual(selectApps([file]), { apps: [], tests: true }, file);
  }
});

test('a change nothing deploys selects nothing', () => {
  assert.deepEqual(selectApps(['docs/tasks/iteration-0.md', 'scripts/verify.mjs', 'manifests/gateway/osaan-gateway.yaml']), {
    apps: [],
    tests: false,
  });
});

test('apps come back in the declared order, each once', () => {
  const { apps } = selectApps([
    'ui/osaan-ui/src/a.ts',
    'microservices/employee-service/pom.xml',
    'ui/osaan-ui/src/b.ts',
    'charts/osaan-microservice/values/employee-service.yaml',
  ]);
  assert.deepEqual(apps, ['employee-service', 'osaan-ui']);
});

test('the app names are the ArgoCD application names, and every app has a chart and a build', () => {
  assert.deepEqual(APPS.map((a) => a.name), [...SERVICES, ...UIS]);
  for (const app of APPS) {
    assert.ok(['osaan-microservice', 'osaan-ui'].includes(app.chart), app.name);
    assert.ok(app.build.dir, app.name);
  }
});

test('parseArgs reads --only, --changed, --list and --reset', () => {
  assert.deepEqual(parseArgs([]), { only: null, changed: 'origin/dev', list: false, reset: false });
  assert.deepEqual(parseArgs(['--only', 'employee-service,osaan-ui']).only, ['employee-service', 'osaan-ui']);
  assert.deepEqual(parseArgs(['--changed', 'origin/main', '--list']), {
    only: null,
    changed: 'origin/main',
    list: true,
    reset: false,
  });
  assert.equal(parseArgs(['--reset']).reset, true);
});

test('parseArgs rejects an unknown app, an unknown flag and a missing value', () => {
  assert.throws(() => parseArgs(['--only', 'admin-frontend']), /unknown component "admin-frontend"/);
  assert.throws(() => parseArgs(['--fast']), /unknown argument "--fast"/);
  assert.throws(() => parseArgs(['--only']), /--only needs a value/);
});

// --- ordering steps and restoring auto-sync ----------------------------------

// A cluster in memory: every app starts with auto-sync on, and every call is logged.
function fakeOps({ failOn = null, workflowFails = null, onCall = () => {} } = {}) {
  const calls = [];
  const autoSync = new Map([ROOT_APP, ...APPS.map((a) => a.name)].map((n) => [n, true]));
  const ignored = new Set();
  const copies = new Set();
  const call = (name, arg) => {
    calls.push(arg === undefined ? name : `${name} ${arg}`);
    onCall(name, arg);
    if (failOn === `${name} ${arg}` || failOn === name) throw new Error(`${name} failed`);
  };
  const ops = {
    build: async (app) => (call('build', app), `osaan-local/${app}:test`),
    importImages: async (images) => call('import', images.join(',')),
    disableAutoSync: async (name) => {
      call('disable-auto-sync', name);
      autoSync.set(name, false);
      return async () => (calls.push(`enable-auto-sync ${name}`), autoSync.set(name, true));
    },
    ignoreSyncPolicy: async (app) => {
      call('ignore-sync-policy', app);
      ignored.add(app);
      return async () => (calls.push(`unignore-sync-policy ${app}`), ignored.delete(app));
    },
    deploy: async (app, image) => call('deploy', `${app}=${image}`),
    waitForRollout: async (app) => call('rollout', app),
    createWorkflowCopy: async (name) => {
      call('create-workflow', name);
      copies.add(`${name}-local`);
      return { name: `${name}-local`, remove: async () => (calls.push(`delete-workflow ${name}-local`), copies.delete(`${name}-local`)) };
    },
    runWorkflow: async (name) => (call('run-workflow', name), name !== workflowFails),
    waitForSync: async (apps) => call('wait-for-sync', apps.join(',')),
  };
  return { ops, calls, autoSync, ignored, copies };
}

const quiet = { log: () => {} };

test('a run builds and imports, pauses, deploys, waits, tests, then restores in reverse', async () => {
  const { ops, calls } = fakeOps();
  const result = await runClusterVerify({ apps: ['employee-service', 'osaan-ui'], tests: true }, ops, quiet);
  assert.equal(result.ok, true);
  assert.deepEqual(calls, [
    'build employee-service',
    'build osaan-ui',
    'import osaan-local/employee-service:test,osaan-local/osaan-ui:test',
    `disable-auto-sync ${ROOT_APP}`,
    'ignore-sync-policy employee-service',
    'disable-auto-sync employee-service',
    'ignore-sync-policy osaan-ui',
    'disable-auto-sync osaan-ui',
    'deploy employee-service=osaan-local/employee-service:test',
    'deploy osaan-ui=osaan-local/osaan-ui:test',
    'rollout employee-service',
    'rollout osaan-ui',
    'create-workflow cluster-smoke',
    'run-workflow cluster-smoke-local',
    'create-workflow osaan-ui-e2e',
    'run-workflow osaan-ui-e2e-local',
    'delete-workflow osaan-ui-e2e-local',
    'delete-workflow cluster-smoke-local',
    'enable-auto-sync osaan-ui',
    'unignore-sync-policy osaan-ui',
    'enable-auto-sync employee-service',
    'unignore-sync-policy employee-service',
    `enable-auto-sync ${ROOT_APP}`,
    'wait-for-sync employee-service,osaan-ui',
  ]);
});

test('the workflows run in the declared order: smoke first', () => {
  assert.deepEqual(WORKFLOWS, ['cluster-smoke', 'osaan-ui-e2e']);
});

test('a tests-only run touches no app and pauses nothing', async () => {
  const { ops, calls } = fakeOps();
  const result = await runClusterVerify({ apps: [], tests: true }, ops, quiet);
  assert.equal(result.ok, true);
  assert.deepEqual(calls, [
    'create-workflow cluster-smoke',
    'run-workflow cluster-smoke-local',
    'create-workflow osaan-ui-e2e',
    'run-workflow osaan-ui-e2e-local',
    'delete-workflow osaan-ui-e2e-local',
    'delete-workflow cluster-smoke-local',
  ]);
});

test('a failed build stops before the cluster is touched', async () => {
  const { ops, calls } = fakeOps({ failOn: 'build osaan-ui' });
  const result = await runClusterVerify({ apps: ['employee-service', 'osaan-ui'], tests: true }, ops, quiet);
  assert.equal(result.ok, false);
  assert.match(result.error.message, /build failed/);
  assert.deepEqual(calls, ['build employee-service', 'build osaan-ui']);
});

for (const failOn of ['deploy', 'rollout', 'create-workflow', 'disable-auto-sync employee-service']) {
  test(`auto-sync is restored everywhere when "${failOn}" fails`, async () => {
    const { ops, autoSync, ignored, copies } = fakeOps({ failOn });
    const result = await runClusterVerify({ apps: ['employee-service'], tests: true }, ops, quiet);
    assert.equal(result.ok, false);
    assert.deepEqual(result.restoreErrors, []);
    assert.ok([...autoSync.values()].every(Boolean), 'every app has auto-sync on');
    assert.equal(ignored.size, 0, 'no ApplicationSet still ignores a sync policy');
    assert.equal(copies.size, 0, 'no workflow copy is left behind');
  });
}

test('a failing smoke workflow fails the run, skips e2e, and restores auto-sync', async () => {
  const { ops, calls, autoSync } = fakeOps({ workflowFails: 'cluster-smoke-local' });
  const result = await runClusterVerify({ apps: ['employee-service'], tests: true }, ops, quiet);
  assert.equal(result.ok, false);
  assert.match(result.error.message, /cluster-smoke-local failed/);
  assert.ok(!calls.includes('run-workflow osaan-ui-e2e-local'));
  assert.ok([...autoSync.values()].every(Boolean));
});

test('an interrupt stops at the next step and still restores auto-sync', async () => {
  let interrupted = false;
  const { ops, calls, autoSync } = fakeOps({ onCall: (name) => name === 'deploy' && (interrupted = true) });
  const result = await runClusterVerify({ apps: ['employee-service'], tests: true }, ops, {
    ...quiet,
    interrupted: () => interrupted,
  });
  assert.equal(result.ok, false);
  assert.equal(result.interrupted, true);
  assert.ok(!calls.includes('rollout employee-service'));
  assert.ok(calls.includes(`enable-auto-sync ${ROOT_APP}`));
  assert.ok(!calls.some((c) => c.startsWith('wait-for-sync')), 'no wait for ArgoCD after Ctrl-C');
  assert.ok([...autoSync.values()].every(Boolean));
});

test('a step that fails because Ctrl-C killed its command counts as interrupted', async () => {
  let interrupted = false;
  const { ops, autoSync } = fakeOps({
    failOn: 'rollout',
    onCall: (name) => name === 'rollout' && (interrupted = true),
  });
  const result = await runClusterVerify({ apps: ['employee-service'], tests: true }, ops, {
    ...quiet,
    interrupted: () => interrupted,
  });
  assert.equal(result.interrupted, true);
  assert.ok([...autoSync.values()].every(Boolean));
});

test('one failing restore step does not stop the others, and fails the run', async () => {
  const { ops, autoSync } = fakeOps();
  const disable = ops.disableAutoSync;
  ops.disableAutoSync = async (name) => {
    const undo = await disable(name);
    return name === 'employee-service'
      ? async () => {
          throw new Error('patch refused');
        }
      : undo;
  };
  const result = await runClusterVerify({ apps: ['employee-service'], tests: true }, ops, quiet);
  assert.equal(result.ok, false);
  assert.equal(result.error, null, 'the verification itself passed');
  assert.deepEqual(result.restoreErrors.map((e) => e.message), ['patch refused']);
  assert.equal(autoSync.get(ROOT_APP), true, 'the root app was still restored');
});

// --- what goes into the cluster ----------------------------------------------

test("trackingId follows ArgoCD's annotation format", () => {
  const deployment = { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: 'employee-service-dep', namespace: 'osaan-dev' } };
  const configMap = { apiVersion: 'v1', kind: 'ConfigMap', metadata: { name: 'employee-service-config' } };
  assert.equal(trackingId('employee-service', deployment), 'employee-service:apps/Deployment:osaan-dev/employee-service-dep');
  assert.equal(trackingId('employee-service', configMap), 'employee-service:/ConfigMap:osaan-dev/employee-service-config');
});

test('withTracking annotates every object and keeps its other annotations', () => {
  const objects = [
    { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: 'd', namespace: 'osaan-dev', annotations: { a: '1' } } },
    { apiVersion: 'v1', kind: 'Service', metadata: { name: 's', namespace: 'osaan-dev' } },
  ];
  const out = withTracking('osaan-ui', objects);
  assert.deepEqual(out[0].metadata.annotations, { a: '1', 'argocd.argoproj.io/tracking-id': 'osaan-ui:apps/Deployment:osaan-dev/d' });
  assert.equal(out[1].metadata.annotations['argocd.argoproj.io/tracking-id'], 'osaan-ui:/Service:osaan-dev/s');
  assert.equal(objects[0].metadata.annotations['argocd.argoproj.io/tracking-id'], undefined, 'input left unchanged');
});

test("workflowCopy runs the working tree's files under its own name, untracked by ArgoCD", () => {
  const manifest = {
    apiVersion: 'testworkflows.testkube.io/v1',
    kind: 'TestWorkflow',
    metadata: {
      name: 'cluster-smoke',
      namespace: 'testkube',
      labels: { app: 'osaan', type: 'smoke' },
      annotations: { 'argocd.argoproj.io/tracking-id': 'argocd-testkube:testworkflows.testkube.io/TestWorkflow:testkube/cluster-smoke' },
    },
    spec: {
      content: { git: { uri: 'https://github.com/MiguelSombrero/osaan', revision: 'dev', paths: ['e2e'] } },
      container: { image: 'mcr.microsoft.com/playwright:v1.57.0-noble', workingDir: '/data/repo/e2e' },
      steps: [{ name: 'Run smoke tests', shell: 'npx playwright test' }],
    },
  };
  const files = [{ path: 'e2e/package.json', content: '{}' }];
  const copy = workflowCopy(manifest, files);
  assert.deepEqual(copy.metadata, {
    name: 'cluster-smoke-local',
    namespace: 'testkube',
    labels: { app: 'osaan', type: 'smoke', 'app.kubernetes.io/managed-by': 'cluster-verify' },
  });
  assert.deepEqual(copy.spec.content, { files: [{ path: '/data/repo/e2e/package.json', content: '{}' }] });
  assert.deepEqual(copy.spec.container, manifest.spec.container);
  assert.deepEqual(copy.spec.steps, manifest.spec.steps);
  assert.ok(manifest.spec.content.git, 'input left unchanged');
});

test('parseJsonStream reads the objects kubectl prints one after another, and a List', () => {
  const stream = '{\n  "kind": "Service",\n  "metadata": {"name": "a}{"}\n}\n{"kind": "Deployment", "note": "a \\" brace {"}\n';
  assert.deepEqual(parseJsonStream(stream).map((o) => o.kind), ['Service', 'Deployment']);
  assert.equal(parseJsonStream(stream)[0].metadata.name, 'a}{');
  assert.deepEqual(parseJsonStream('{"kind":"List","items":[{"kind":"A"},{"kind":"B"}]}').map((o) => o.kind), ['A', 'B']);
  assert.deepEqual(parseJsonStream('  \n'), []);
});

test('a service image is built from a clean Maven build, osaan-core first and only once', () => {
  const app = APPS.find((a) => a.name === 'employee-service');
  const withCore = buildCommands(app, 'osaan-local/employee-service:t', { withCore: true });
  assert.deepEqual(
    withCore.map(([cmd, args]) => [cmd, args.filter((a) => !a.startsWith('-'))]),
    [
      ['mvn', ['microservices/osaan-core/pom.xml', 'clean', 'install']],
      ['mvn', ['microservices/employee-service/pom.xml', 'clean', 'package']],
      ['docker', ['build', 'osaan-local/employee-service:t', 'microservices/employee-service']],
    ],
  );
  assert.equal(buildCommands(app, 'i', { withCore: false }).length, 2);
});

test('a UI image is built by Docker alone', () => {
  const app = APPS.find((a) => a.name === 'osaan-admin-ui');
  assert.deepEqual(buildCommands(app, 'i', { withCore: true }), [['docker', ['build', '-t', 'i', 'ui/osaan-admin-ui/frontend']]]);
});
