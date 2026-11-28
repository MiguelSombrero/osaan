#!/usr/bin/env node
// k3d is the only full-stack runtime and its versions are the source of truth.
// Fails when docker-compose.yaml runs anything but the shared infrastructure,
// or an image whose version differs from what the k3d files declare.
//
// Usage: node scripts/check-compose-versions.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const END = String.raw`(?: +#.*)?$`;
const line = (source) => new RegExp(source + END, 'm');

// One entry per Compose service: where k3d declares the version, and the image
// Compose must run for it.
const COMPONENTS = [
  {
    service: 'osaan-db',
    file: 'manifests/platform/postgres/postgres.yaml',
    declared: line(String.raw`^ *image: *\S+/crunchy-postgres:ubi\d+-(\d+\.\d+)-\d+`),
    image: (version) => `postgres:${version}-alpine`,
  },
  {
    service: 'rabbitmq',
    file: 'manifests/platform/rabbitmq/rabbitmq.yaml',
    declared: line(String.raw`^ *image: *rabbitmq:(\d+\.\d+\.\d+\S*)`),
    image: (version) => `rabbitmq:${version}`,
  },
  {
    service: 'keycloak',
    file: 'setup-cluster.sh',
    declared: line(String.raw`^KEYCLOAK_VERSION="(\d+\.\d+\.\d+)"`),
    image: (version) => `quay.io/keycloak/keycloak:${version}`,
  },
  {
    service: 'osaan-valkey',
    file: 'manifests/argocd-apps/valkey-app.yaml',
    declared: line(String.raw`^ +image:\n +tag: *"(\d+\.\d+\.\d+)"`),
    image: (version) => `valkey/valkey:${version}-alpine`,
  },
  {
    service: 'mailhog',
    file: 'manifests/platform/mail-server/mailhog.yaml',
    declared: line(String.raw`^ *image: *mailhog/mailhog:(v\d+\.\d+\.\d+)`),
    image: (version) => `mailhog/mailhog:${version}`,
  },
];

export function findProblems(services, read) {
  const problems = [];
  const known = COMPONENTS.map((c) => c.service);
  for (const name of Object.keys(services)) {
    if (services[name] && !known.includes(name)) {
      problems.push(`${name}: not shared infrastructure; Compose runs only ${known.join(', ')}`);
    }
  }
  for (const { service, file, declared, image } of COMPONENTS) {
    if (!services[service]) {
      problems.push(`${service}: missing from docker-compose.yaml`);
      continue;
    }
    const content = read(file);
    const version = content.match(declared)?.[1];
    if (!version) {
      problems.push(`${service}: ${file} declares no exact version`);
      continue;
    }
    const major = content.match(/^ *postgresVersion: *(\d+)/m)?.[1];
    if (major && major !== version.split('.')[0]) {
      problems.push(`${service}: ${file} has postgresVersion ${major} but its image is ${version}`);
    }
    const actual = services[service].image ?? '(none)';
    if (actual !== image(version)) {
      problems.push(`${service}: image is ${actual}, expected ${image(version)} (k3d version in ${file})`);
    }
  }
  return problems;
}

function composeServices() {
  // --profile '*' so a service cannot hide behind a profile.
  const args = ['compose', '-f', 'docker-compose.yaml', '--profile', '*', 'config', '--format', 'json'];
  return JSON.parse(execFileSync('docker', args, { cwd: ROOT, encoding: 'utf8' })).services;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const problems = findProblems(composeServices(), (file) => readFileSync(join(ROOT, file), 'utf8'));
    if (problems.length > 0) {
      console.error(`check-compose-versions:\n  ${problems.join('\n  ')}`);
      process.exit(1);
    }
    console.log('docker-compose.yaml: OK, the versions k3d declares');
  } catch (err) {
    console.error(`check-compose-versions: ${err.message}`);
    process.exit(2);
  }
}
