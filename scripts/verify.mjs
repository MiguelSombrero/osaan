#!/usr/bin/env node
// The one gate: tests, lint, type-check and build for every component, or for
// the ones a diff touches. CI runs the same command on every pull request.
//
// Usage:
//   node scripts/verify.mjs                      every component
//   node scripts/verify.mjs --only a,b           the named components
//   node scripts/verify.mjs --changed origin/dev what differs from a base,
//                                                uncommitted changes included
//   add --list to print the selected names as JSON instead of running them
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = 'microservices/osaan-core';

const run = (cmd, ...args) => ({ cmd, args });
const npmCi = { kind: 'npm-ci' };
const mvn = (...goals) => run('mvn', '-B', '--no-transfer-progress', ...goals);
const vitest = run('npx', '--no-install', 'vitest', 'run');

const service = (name) => ({
  name,
  dir: `microservices/${name}`,
  paths: [`microservices/${name}/`, `${CORE}/`],
  steps: [{ ...mvn('install', '-DskipTests'), cwd: CORE }, mvn('verify')],
});

export const COMPONENTS = [
  {
    name: 'scripts',
    dir: '.',
    paths: ['scripts/', 'docs/', 'CLAUDE.md', '.claude/'],
    steps: [run('node', '--test', 'scripts/*.test.mjs'), run('node', 'scripts/check-tasks.mjs')],
  },
  { name: 'osaan-core', dir: CORE, paths: [`${CORE}/`], steps: [mvn('install')] },
  service('employee-service'),
  service('skill-catalog-service'),
  service('competence-profile-service'),
  service('competence-matching-service'),
  {
    name: 'admin-backend',
    dir: 'ui/osaan-admin-ui/backend',
    paths: ['ui/osaan-admin-ui/backend/', 'ui/osaan-admin-ui/package.json'],
    steps: [npmCi, run('npm', 'run', 'lint'), run('npm', 'test')],
  },
  {
    name: 'admin-frontend',
    dir: 'ui/osaan-admin-ui/frontend',
    paths: ['ui/osaan-admin-ui/frontend/', 'ui/osaan-admin-ui/backend/src/openapi/', 'ui/osaan-admin-ui/package.json'],
    steps: [
      npmCi,
      { kind: 'generated-unchanged', generate: run('npm', 'run', 'generate:client'), path: 'src/api/generated' },
      run('npm', 'run', 'lint'),
      vitest,
      run('npm', 'run', 'build'),
    ],
  },
  {
    name: 'osaan-ui',
    dir: 'ui/osaan-ui',
    paths: ['ui/osaan-ui/'],
    steps: [npmCi, run('npm', 'run', 'type-check'), run('npm', 'run', 'lint'), vitest, run('npm', 'run', 'build')],
  },
  {
    name: 'e2e',
    dir: 'e2e',
    paths: ['e2e/'],
    steps: [
      npmCi,
      run('npx', '--no-install', 'playwright', 'test', '--list'),
      run('npx', '--no-install', 'playwright', 'test', '--list', '--config', 'playwright.smoke.config.ts'),
    ],
  },
];

// A change to any of these can change what every component's check means.
const GATE_FILES = ['Makefile', 'scripts/verify.mjs'];
const GATE_DIRS = ['.github/workflows/'];

const NAMES = COMPONENTS.map((c) => c.name);

export function selectComponents(changedFiles) {
  if (changedFiles.some((f) => GATE_FILES.includes(f) || GATE_DIRS.some((d) => f.startsWith(d)))) return NAMES;
  return COMPONENTS.filter((c) => changedFiles.some((f) => c.paths.some((p) => f === p || f.startsWith(p)))).map(
    (c) => c.name,
  );
}

export function parseArgs(argv) {
  const options = { only: null, changed: null, list: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--list') {
      options.list = true;
    } else if (arg === '--only' || arg === '--changed') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new Error(`${arg} needs a value`);
      if (arg === '--changed') {
        options.changed = value;
      } else {
        options.only = value.split(',').filter(Boolean);
        for (const name of options.only) {
          if (!NAMES.includes(name)) throw new Error(`unknown component "${name}"; known: ${NAMES.join(', ')}`);
        }
      }
    } else {
      throw new Error(`unknown argument "${arg}"`);
    }
  }
  return options;
}

// Locally, reinstall only when node_modules is missing or older than the
// lockfile; CI always starts clean.
export function needsNpmCi({ ci, installedAt, lockfileAt }) {
  return ci || installedAt === null || lockfileAt > installedAt;
}

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
}

export function changedFiles(base) {
  return [
    ...new Set([
      ...git('diff', '--name-only', `${base}...HEAD`),
      ...git('diff', '--name-only', 'HEAD'),
      ...git('ls-files', '--others', '--exclude-standard'),
    ]),
  ];
}

function mtime(path) {
  return existsSync(path) ? statSync(path).mtimeMs : null;
}

function exec({ cmd, args, cwd }) {
  console.log(`\n$ (cd ${cwd} && ${[cmd, ...args].join(' ')})`);
  const result = spawnSync(cmd, args, { cwd: join(ROOT, cwd), stdio: 'inherit' });
  return result.status === 0;
}

function runStep(step, component) {
  const cwd = step.cwd ?? component.dir;
  if (step.kind === 'npm-ci') {
    const dir = join(ROOT, cwd);
    const install = {
      ci: Boolean(process.env.CI),
      installedAt: mtime(join(dir, 'node_modules', '.package-lock.json')),
      lockfileAt: mtime(join(dir, 'package-lock.json')),
    };
    if (!needsNpmCi(install)) return true;
    return exec({ cmd: 'npm', args: ['ci', '--no-audit', '--no-fund'], cwd });
  }
  if (step.kind === 'generated-unchanged') {
    const generated = join(cwd, step.path);
    const advice =
      'Never edit generated clients by hand: change the OpenAPI spec, run npm run generate:client, and commit the result.';
    // Regenerating would overwrite uncommitted edits, so refuse rather than erase them.
    const uncommitted = git('status', '--porcelain', '--', generated);
    if (uncommitted.length > 0) {
      console.error(`\n${generated} has uncommitted changes:\n${uncommitted.join('\n')}\n${advice}`);
      return false;
    }
    if (!exec({ ...step.generate, cwd })) return false;
    const drift = git('status', '--porcelain', '--', generated);
    if (drift.length === 0) return true;
    console.error(`\n${generated} differs from what the generator produces:\n${drift.join('\n')}\n${advice}`);
    return false;
  }
  return exec({ ...step, cwd });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const names = options.only ?? (options.changed ? selectComponents(changedFiles(options.changed)) : NAMES);
  if (options.list) {
    console.log(JSON.stringify(names));
    return 0;
  }
  if (names.length === 0) {
    console.log('verify: nothing to check for these changes.');
    return 0;
  }
  const results = [];
  for (const component of COMPONENTS.filter((c) => names.includes(c.name))) {
    const started = Date.now();
    console.log(`\n=== verify ${component.name}`);
    const ok = component.steps.every((step) => runStep(step, component));
    results.push({ name: component.name, ok, seconds: Math.round((Date.now() - started) / 1000) });
    if (!ok) break;
  }
  console.log('\n=== verify summary');
  for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'}  ${r.name} (${r.seconds}s)`);
  const skipped = names.filter((n) => !results.some((r) => r.name === n));
  if (skipped.length > 0) console.log(`not run after the failure: ${skipped.join(', ')}`);
  return results.every((r) => r.ok) ? 0 : 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.exit(main());
  } catch (err) {
    console.error(`verify: ${err.message}`);
    process.exit(2);
  }
}
