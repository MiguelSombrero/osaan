import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './cluster-status.mjs';

function app(name, sync, health) {
  const status = {};
  if (sync) status.sync = { status: sync };
  if (health) status.health = { status: health };
  return { metadata: { name, namespace: 'argocd' }, status };
}

test('all applications Synced and Healthy is ok', () => {
  const result = summarize({ items: [app('a', 'Synced', 'Healthy'), app('b', 'Synced', 'Healthy')] });
  assert.equal(result.ok, true);
  assert.deepEqual(result.notReady, []);
});

test('an OutOfSync application is not ok and is named', () => {
  const result = summarize({ items: [app('a', 'Synced', 'Healthy'), app('b', 'OutOfSync', 'Healthy')] });
  assert.equal(result.ok, false);
  assert.deepEqual(result.notReady, ['b']);
});

test('a Degraded or Progressing application is not ok', () => {
  const result = summarize({ items: [app('a', 'Synced', 'Degraded'), app('b', 'Synced', 'Progressing')] });
  assert.equal(result.ok, false);
  assert.deepEqual(result.notReady, ['a', 'b']);
});

test('an application with no status yet counts as Unknown and is not ok', () => {
  const result = summarize({ items: [app('a')] });
  assert.equal(result.ok, false);
  assert.deepEqual(result.rows, [{ name: 'a', sync: 'Unknown', health: 'Unknown' }]);
});

test('no applications at all is not ok', () => {
  const result = summarize({ items: [] });
  assert.equal(result.ok, false);
});

test('rows are sorted by name', () => {
  const result = summarize({ items: [app('zeta', 'Synced', 'Healthy'), app('alpha', 'Synced', 'Healthy')] });
  assert.deepEqual(result.rows.map((r) => r.name), ['alpha', 'zeta']);
});
