#!/usr/bin/env node
// Prints every ArgoCD application's sync and health status in k3d-osaan-dev,
// and exits non-zero unless all are Synced and Healthy.
// Usage: node scripts/cluster-status.mjs [--context <kube-context>]
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function summarize(list) {
  const rows = list.items
    .map((item) => ({
      name: item.metadata.name,
      sync: item.status?.sync?.status ?? 'Unknown',
      health: item.status?.health?.status ?? 'Unknown',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const notReady = rows.filter((r) => r.sync !== 'Synced' || r.health !== 'Healthy').map((r) => r.name);
  return { rows, notReady, ok: rows.length > 0 && notReady.length === 0 };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const contextFlag = process.argv.indexOf('--context');
  const context = contextFlag > -1 ? process.argv[contextFlag + 1] : 'k3d-osaan-dev';
  if (!context) {
    console.error('Usage: node scripts/cluster-status.mjs [--context <kube-context>]');
    process.exit(2);
  }
  const json = execFileSync(
    'kubectl',
    ['--context', context, 'get', 'applications.argoproj.io', '-A', '-o', 'json'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  const { rows, notReady, ok } = summarize(JSON.parse(json));
  const width = Math.max(4, ...rows.map((r) => r.name.length));
  console.log(`${'NAME'.padEnd(width)}  ${'SYNC'.padEnd(10)}  HEALTH`);
  for (const r of rows) console.log(`${r.name.padEnd(width)}  ${r.sync.padEnd(10)}  ${r.health}`);
  if (rows.length === 0) console.error('No ArgoCD applications found.');
  else if (!ok) console.error(`\nNot Synced and Healthy: ${notReady.join(', ')}`);
  process.exit(ok ? 0 : 1);
}
