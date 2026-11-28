#!/usr/bin/env node
// Verifies the working tree in k3d-osaan-dev before it merges: builds the
// changed apps' images locally, imports them into k3d, pauses ArgoCD auto-sync
// for those apps only, deploys the branch's chart and values with the local
// images, waits for the rollout, runs the cluster-smoke and osaan-ui-e2e
// Testkube workflows with the working tree's e2e/ tests, and restores
// auto-sync, also when a step fails or the run is interrupted. ArgoCD then
// returns the apps to what dev declares.
//
// Usage:
//   node scripts/cluster-verify.mjs                      what differs from origin/dev
//   node scripts/cluster-verify.mjs --changed <base>     what differs from <base>
//   node scripts/cluster-verify.mjs --only a,b           the named ArgoCD apps
//   node scripts/cluster-verify.mjs --list               print the selection and stop
//   node scripts/cluster-verify.mjs --reset              return every app to what dev declares
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { summarize } from './cluster-status.mjs';
import { changedFiles, MAVEN_SHARED_PATHS } from './verify.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLUSTER = 'osaan-dev';
const CONTEXT = `k3d-${CLUSTER}`;
const NAMESPACE = 'osaan-dev';
// Where Testkube puts a workflow's git content; the workflows' workingDir is under it.
const REPO_MOUNT = '/data/repo';
const MANAGED_BY = { 'app.kubernetes.io/managed-by': 'cluster-verify' };

export const ROOT_APP = 'osaan-apps';
export const WORKFLOWS = ['cluster-smoke', 'osaan-ui-e2e'];

const service = (name) => ({
  name,
  chart: 'osaan-microservice',
  build: { dir: `microservices/${name}`, maven: true },
  paths: [`microservices/${name}/`, ...MAVEN_SHARED_PATHS],
});
const ui = (name, dir) => ({ name, chart: 'osaan-ui', build: { dir }, paths: [`${dir}/`] });

// Names are the ArgoCD application names.
export const APPS = [
  service('employee-service'),
  service('skill-catalog-service'),
  service('competence-profile-service'),
  service('competence-matching-service'),
  ui('osaan-ui', 'ui/osaan-ui'),
  ui('osaan-admin-ui', 'ui/osaan-admin-ui/frontend'),
  ui('osaan-admin-backend', 'ui/osaan-admin-ui/backend'),
];
const NAMES = APPS.map((a) => a.name);
const TEST_PATHS = ['e2e/', ...WORKFLOWS.map((w) => `manifests/testkube/${w}.yaml`)];

function appsFor(file) {
  const owners = APPS.filter((a) => a.paths.some((p) => file.startsWith(p)));
  const chart = file.match(/^charts\/([^/]+)\/(.*)$/);
  if (!chart) return owners;
  const [, name, rest] = chart;
  if (rest.startsWith('.argocd-source-')) return []; // Image Updater's digest pins for dev
  const values = rest.match(/^values\/(.+)\.yaml$/);
  return APPS.filter((a) => a.chart === name && (!values || values[1] === a.name));
}

export function selectApps(files) {
  const selected = new Set(files.flatMap((f) => appsFor(f).map((a) => a.name)));
  const apps = NAMES.filter((n) => selected.has(n));
  const tests = apps.length > 0 || files.some((f) => TEST_PATHS.some((p) => f === p || f.startsWith(p)));
  return { apps, tests };
}

export function parseArgs(argv) {
  const options = { only: null, changed: 'origin/dev', list: false, reset: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--list') options.list = true;
    else if (arg === '--reset') options.reset = true;
    else if (arg === '--only' || arg === '--changed') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new Error(`${arg} needs a value`);
      if (arg === '--changed') options.changed = value;
      else {
        options.only = value.split(',').filter(Boolean);
        for (const name of options.only) {
          if (!NAMES.includes(name)) throw new Error(`unknown component "${name}"; known: ${NAMES.join(', ')}`);
        }
      }
    } else throw new Error(`unknown argument "${arg}"`);
  }
  return options;
}

// --- the run -----------------------------------------------------------------

class Interrupted extends Error {
  constructor() {
    super('interrupted');
  }
}

// Every change to the cluster pushes its undo before the next step starts;
// the undos run in reverse whatever happens, and one failing undo does not
// stop the others.
export async function runClusterVerify({ apps, tests }, ops, { log = console.log, interrupted = () => false } = {}) {
  const undo = [];
  const result = { ok: false, error: null, interrupted: false, restoreErrors: [] };
  const step = async (label, fn) => {
    if (interrupted()) throw new Interrupted();
    log(label);
    const value = await fn();
    if (interrupted()) throw new Interrupted();
    return value;
  };
  let paused = false;
  try {
    const images = {};
    for (const app of apps) images[app] = await step(`build ${app}`, () => ops.build(app));
    if (apps.length > 0) {
      await step('import images into k3d', () => ops.importImages(apps.map((a) => images[a])));
      await step(`pause auto-sync of ${ROOT_APP}`, async () => undo.push(await ops.disableAutoSync(ROOT_APP)));
      paused = true;
      for (const app of apps) {
        await step(`pause auto-sync of ${app}`, async () => {
          undo.push(await ops.ignoreSyncPolicy(app));
          undo.push(await ops.disableAutoSync(app));
        });
      }
      for (const app of apps) await step(`deploy ${app} with ${images[app]}`, () => ops.deploy(app, images[app]));
      for (const app of apps) await step(`wait for ${app} to roll out`, () => ops.waitForRollout(app));
    }
    if (tests) {
      for (const workflow of WORKFLOWS) {
        const copy = await step(`create ${workflow} with the working tree's e2e/`, async () => {
          const created = await ops.createWorkflowCopy(workflow);
          undo.push(created.remove);
          return created;
        });
        const passed = await step(`run ${copy.name}`, () => ops.runWorkflow(copy.name));
        if (!passed) throw new Error(`workflow ${copy.name} failed`);
      }
    }
    result.ok = true;
  } catch (err) {
    result.error = err;
    // Ctrl-C reaches the running command too, so its step fails rather than
    // reaching the check between steps.
    result.interrupted = err instanceof Interrupted || interrupted();
  }
  if (undo.length > 0) log('restore auto-sync and remove the workflow copies');
  for (const fn of undo.reverse()) {
    try {
      await fn();
    } catch (err) {
      result.restoreErrors.push(err);
    }
  }
  // After Ctrl-C the user wants out: auto-sync is back, ArgoCD finishes alone.
  if (paused && result.restoreErrors.length === 0 && !result.interrupted) {
    log(`wait for ArgoCD to return ${apps.join(', ')} to dev`);
    try {
      await ops.waitForSync(apps);
    } catch (err) {
      log(`warning: ${err.message}`);
    }
  }
  result.ok = result.ok && result.restoreErrors.length === 0;
  return result;
}

// --- what goes into the cluster ----------------------------------------------

export function trackingId(app, object) {
  const group = object.apiVersion.includes('/') ? object.apiVersion.split('/')[0] : '';
  const namespace = object.metadata.namespace ?? NAMESPACE;
  return `${app}:${group}/${object.kind}:${namespace}/${object.metadata.name}`;
}

// ArgoCD's tracking annotation keeps the objects the app's own: while paused
// it shows them OutOfSync, and when auto-sync is back it reverts and prunes them.
export function withTracking(app, objects) {
  return objects.map((object) => {
    const copy = structuredClone(object);
    copy.metadata.annotations = { ...copy.metadata.annotations, 'argocd.argoproj.io/tracking-id': trackingId(app, object) };
    return copy;
  });
}

// A copy under its own name, with fresh metadata so ArgoCD neither tracks nor
// prunes it, that runs the given files instead of cloning dev.
export function workflowCopy(manifest, files) {
  const copy = structuredClone(manifest);
  copy.metadata = {
    name: `${manifest.metadata.name}-local`,
    namespace: manifest.metadata.namespace ?? 'testkube',
    labels: { ...manifest.metadata.labels, ...MANAGED_BY },
  };
  const { git, ...content } = copy.spec.content ?? {};
  const inline = files.map((f) => ({ path: `${REPO_MOUNT}/${f.path}`, content: f.content }));
  copy.spec.content = { ...content, files: [...(content.files ?? []), ...inline] };
  return copy;
}

// The image must hold only the working tree: `clean` drops classes another
// branch's build left in target/, which Spring would load as well.
export function buildCommands(app, image) {
  const commands = [];
  if (app.build.maven) {
    commands.push([
      './mvnw',
      ['-B', '--no-transfer-progress', '-q', '-pl', app.name, '-am', 'clean', 'package', '-DskipTests'],
      { cwd: 'microservices' },
    ]);
  }
  commands.push(['docker', ['build', '-t', image, app.build.dir]]);
  return commands;
}

// --- commands ----------------------------------------------------------------

function sh(cmd, args, { input, capture = false, env, cwd = '.' } = {}) {
  if (!capture) console.log(`$ ${cwd === '.' ? '' : `cd ${cwd} && `}${[cmd, ...args].join(' ')}`);
  const result = spawnSync(cmd, args, {
    cwd: join(ROOT, cwd),
    input,
    env: env ? { ...process.env, ...env } : process.env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    // Short captured commands get their own process group, so a second Ctrl-C
    // cannot kill the patches that restore auto-sync.
    detached: capture,
    stdio: [input === undefined ? 'inherit' : 'pipe', capture ? 'pipe' : 'inherit', capture ? 'pipe' : 'inherit'],
  });
  if (result.error) throw new Error(result.error.code === 'ENOENT' ? `${cmd} is not installed` : result.error.message);
  if (result.status !== 0) {
    const detail = capture && result.stderr ? `: ${result.stderr.trim()}` : '';
    const shown = args.filter((a, i) => a !== '--context' && args[i - 1] !== '--context').slice(0, 4);
    throw new Error(`${[cmd, ...shown].join(' ')} exited with ${result.status ?? result.signal}${detail}`);
  }
  return result.stdout;
}

const kubectl = (args, options) => sh('kubectl', ['--context', CONTEXT, ...args], options);
const getJson = (kind, name, namespace = 'argocd') =>
  JSON.parse(kubectl(['-n', namespace, 'get', kind, name, '-o', 'json'], { capture: true }));
const patch = (kind, name, body, namespace = 'argocd') =>
  kubectl(['-n', namespace, 'patch', kind, name, '--type', 'merge', '-p', JSON.stringify(body)], { capture: true });

// kubectl prints one JSON object per input document, one after another, so
// split the stream at each top-level object's closing brace.
export function parseJsonStream(text) {
  const objects = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (c === '\\') i++;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === '{') {
      if (depth++ === 0) start = i;
    } else if (c === '}' && --depth === 0) objects.push(JSON.parse(text.slice(start, i + 1)));
  }
  return objects.flatMap((o) => (o.kind === 'List' ? o.items : [o]));
}

// kubectl parses the YAML, so the script needs no YAML library.
function toObjects(yaml) {
  return parseJsonStream(kubectl(['create', '--dry-run=client', '-o', 'json', '-f', '-'], { input: yaml, capture: true }));
}

const isAutoSyncOn = (app) => Boolean(app.spec.syncPolicy?.automated) && app.spec.syncPolicy.automated.enabled !== false;

function e2eFiles() {
  const listed = [
    ...sh('git', ['ls-files', '-z', 'e2e'], { capture: true }).split('\0'),
    ...sh('git', ['ls-files', '-z', '--others', '--exclude-standard', 'e2e'], { capture: true }).split('\0'),
  ];
  const paths = [...new Set(listed.filter(Boolean))].filter((p) => existsSync(join(ROOT, p)) && statSync(join(ROOT, p)).isFile());
  const files = paths.sort().map((path) => {
    const bytes = readFileSync(join(ROOT, path));
    if (bytes.includes(0)) throw new Error(`${path} is binary; a workflow copy can only carry text files`);
    return { path, content: bytes.toString('utf8') };
  });
  const size = files.reduce((n, f) => n + Buffer.byteLength(f.content), 0);
  if (size > 1024 * 1024) throw new Error(`e2e/ is ${Math.round(size / 1024)} KiB; a workflow copy holds at most 1 MiB`);
  return files;
}

function clusterOps({ runId }) {
  const deployments = new Map();
  let kubeconfigDir = null;
  // Testkube's CLI talks to the current kube context; pin it to the cluster
  // without changing the user's current context.
  const kubeconfig = () => {
    if (!kubeconfigDir) {
      kubeconfigDir = mkdtempSync(join(tmpdir(), 'cluster-verify-'));
      const config = kubectl(['config', 'view', '--minify', '--flatten'], { capture: true });
      writeFileSync(join(kubeconfigDir, 'config'), config, { mode: 0o600 });
    }
    return join(kubeconfigDir, 'config');
  };
  const appOf = (name) => APPS.find((a) => a.name === name);

  return {
    async build(name) {
      const image = `osaan-local/${name}:${runId}`;
      for (const [cmd, args, options] of buildCommands(appOf(name), image)) sh(cmd, args, options);
      return image;
    },

    async importImages(images) {
      sh('k3d', ['image', 'import', '--cluster', CLUSTER, ...images]);
    },

    async disableAutoSync(name) {
      const app = getJson('application', name);
      if (!isAutoSyncOn(app)) {
        throw new Error(
          `auto-sync is already off for ${name}. Another cluster-verify may be running; if not, run make cluster-reset`,
        );
      }
      const { automated } = app.spec.syncPolicy;
      patch('application', name, { spec: { syncPolicy: { automated: null } } });
      const restore = async () => patch('application', name, { spec: { syncPolicy: { automated } } });
      // An ApplicationSet that still owned the field would put it straight back.
      try {
        await sleep(3000);
        if (isAutoSyncOn(getJson('application', name))) throw new Error(`auto-sync of ${name} was turned back on`);
      } catch (err) {
        await restore().catch(() => {});
        throw err;
      }
      return restore;
    },

    async ignoreSyncPolicy(name) {
      const owner = getJson('application', name).metadata.ownerReferences?.find((r) => r.kind === 'ApplicationSet');
      if (!owner) return async () => {};
      const saved = getJson('applicationset', owner.name).spec.ignoreApplicationDifferences ?? null;
      const ignore = [...(saved ?? []), { name, jsonPointers: ['/spec/syncPolicy'] }];
      patch('applicationset', owner.name, { spec: { ignoreApplicationDifferences: ignore } });
      return async () => patch('applicationset', owner.name, { spec: { ignoreApplicationDifferences: saved } });
    },

    async deploy(name, image) {
      const app = appOf(name);
      const at = image.lastIndexOf(':');
      const yaml = sh(
        'helm',
        [
          'template', name, `charts/${app.chart}`,
          '--namespace', NAMESPACE,
          '-f', `charts/${app.chart}/values/${name}.yaml`,
          '--set-string', `image.repository=${image.slice(0, at)}`,
          '--set-string', `image.tag=${image.slice(at + 1)}`,
          '--set-string', 'image.pullPolicy=IfNotPresent',
        ],
        { capture: true },
      );
      const objects = withTracking(name, toObjects(yaml));
      kubectl(['apply', '-f', '-'], { input: JSON.stringify({ apiVersion: 'v1', kind: 'List', items: objects }) });
      deployments.set(
        name,
        objects.filter((o) => o.kind === 'Deployment').map((o) => ({ namespace: o.metadata.namespace ?? NAMESPACE, name: o.metadata.name })),
      );
    },

    async waitForRollout(name) {
      for (const d of deployments.get(name) ?? []) {
        kubectl(['-n', d.namespace, 'rollout', 'status', `deployment/${d.name}`, '--timeout=5m']);
      }
    },

    async createWorkflowCopy(name) {
      const [manifest] = toObjects(readFileSync(join(ROOT, `manifests/testkube/${name}.yaml`), 'utf8'));
      const copy = workflowCopy(manifest, e2eFiles());
      kubectl(['apply', '-f', '-'], { input: JSON.stringify(copy) });
      const { name: copyName, namespace } = copy.metadata;
      return {
        name: copyName,
        remove: async () => kubectl(['-n', namespace, 'delete', 'testworkflow', copyName, '--ignore-not-found'], { capture: true }),
      };
    },

    async runWorkflow(name) {
      const env = { KUBECONFIG: kubeconfig() };
      try {
        sh('testkube', ['run', 'testworkflow', name, '--watch'], { env });
        return true;
      } catch (err) {
        if (/is not installed/.test(err.message)) throw err;
        return false;
      }
    },

    async waitForSync(apps) {
      await waitFor(5 * 60, () => {
        const pending = apps.filter((name) => {
          const app = getJson('application', name);
          return !isAutoSyncOn(app) || app.status?.sync?.status !== 'Synced' || app.status?.health?.status !== 'Healthy';
        });
        return pending.length === 0 ? null : `${pending.join(', ')} not yet Synced and Healthy`;
      });
    },

    dispose() {
      if (kubeconfigDir) rmSync(kubeconfigDir, { recursive: true, force: true });
    },
  };
}

// Polls until check() returns null; throws its last message on timeout.
async function waitFor(seconds, check) {
  const deadline = Date.now() + seconds * 1000;
  for (;;) {
    const pending = check();
    if (pending === null) return;
    if (Date.now() > deadline) throw new Error(`timed out after ${seconds}s: ${pending}`);
    await sleep(5000);
  }
}

// --- make cluster-reset --------------------------------------------------------

async function reset() {
  const log = (msg) => console.log(`\n=== cluster-reset: ${msg}`);
  log('fetch origin dev');
  try {
    sh('git', ['fetch', '--quiet', 'origin', 'dev']);
  } catch (err) {
    console.error(`warning: ${err.message}; using the origin/dev already fetched`);
  }
  const fromDev = (path) => sh('git', ['show', `origin/dev:${path}`], { capture: true });

  log('delete workflow copies');
  kubectl(['-n', 'testkube', 'delete', 'testworkflow', '-l', 'app.kubernetes.io/managed-by=cluster-verify', '--ignore-not-found']);

  log(`restore the sync policy of ${ROOT_APP}`);
  const [root] = toObjects(fromDev('argocd/app-of-apps.yaml'));
  patch('application', ROOT_APP, { spec: { syncPolicy: root.spec.syncPolicy } });

  const files = sh('git', ['ls-tree', '-r', '--name-only', 'origin/dev', 'manifests/argocd-apps/'], { capture: true })
    .split('\n')
    .filter((f) => /\.ya?ml$/.test(f));
  const declared = toObjects(files.map(fromDev).join('\n---\n')).filter((o) => o.kind === 'ApplicationSet');
  const live = JSON.parse(kubectl(['-n', 'argocd', 'get', 'applications', '-o', 'json'], { capture: true })).items;
  for (const appset of declared) {
    log(`restore ${appset.metadata.name} and its apps`);
    patch('applicationset', appset.metadata.name, {
      spec: { ignoreApplicationDifferences: appset.spec.ignoreApplicationDifferences ?? null },
    });
    const children = live.filter((a) => a.metadata.ownerReferences?.some((r) => r.kind === 'ApplicationSet' && r.name === appset.metadata.name));
    for (const app of children) patch('application', app.metadata.name, { spec: { syncPolicy: appset.spec.template.spec.syncPolicy } });
  }

  log('hard-refresh every app and wait until all are Synced and Healthy');
  kubectl(['-n', 'argocd', 'annotate', 'applications', '--all', 'argocd.argoproj.io/refresh=hard', '--overwrite'], { capture: true });
  await sleep(5000);
  let rows = [];
  try {
    await waitFor(10 * 60, () => {
      const status = summarize(JSON.parse(kubectl(['get', 'applications.argoproj.io', '-A', '-o', 'json'], { capture: true })));
      rows = status.rows;
      return status.ok ? null : `not Synced and Healthy: ${status.notReady.join(', ')}`;
    });
  } finally {
    for (const r of rows) console.log(`${r.name.padEnd(30)}  ${r.sync.padEnd(10)}  ${r.health}`);
  }
}

// --- main --------------------------------------------------------------------

async function main(argv) {
  const options = parseArgs(argv);
  if (options.reset) {
    await reset();
    return 0;
  }
  const selection = options.only
    ? { apps: NAMES.filter((n) => options.only.includes(n)), tests: true }
    : selectApps(changedFiles(options.changed));
  if (options.list) {
    console.log(JSON.stringify(selection));
    return 0;
  }
  if (selection.apps.length === 0 && !selection.tests) {
    console.log(`cluster-verify: nothing deployable or tested differs from ${options.changed}. Name apps with COMPONENTS=...`);
    return 0;
  }
  kubectl(['config', 'get-contexts', CONTEXT], { capture: true });
  // Fail before the build, not after it; disableAutoSync checks again.
  if (selection.apps.length > 0 && !isAutoSyncOn(getJson('application', ROOT_APP))) {
    throw new Error(`auto-sync is already off for ${ROOT_APP}. Another cluster-verify may be running; if not, run make cluster-reset`);
  }

  let interrupted = false;
  const onSignal = (signal) => {
    if (!interrupted) console.error(`\ncluster-verify: ${signal}; finishing the current step, then restoring auto-sync`);
    interrupted = true;
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);

  console.log(`cluster-verify: apps [${selection.apps.join(', ')}], tests ${selection.tests ? 'yes' : 'no'}`);
  const runId = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const ops = clusterOps({ runId });
  const result = await runClusterVerify(selection, ops, {
    log: (msg) => console.log(`\n=== cluster-verify: ${msg}`),
    interrupted: () => interrupted,
  });
  ops.dispose();

  console.log('\n=== cluster-verify summary');
  if (result.ok) console.log('ok: deployed, tested and restored');
  if (result.error) console.error(`FAIL: ${result.error.message}`);
  for (const err of result.restoreErrors) console.error(`RESTORE FAILED: ${err.message}`);
  if (result.restoreErrors.length > 0) console.error('Auto-sync may still be off: run make cluster-reset');
  if (result.interrupted) return 130;
  return result.ok ? 0 : 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(`cluster-verify: ${err.message}`);
      process.exit(2);
    },
  );
}
