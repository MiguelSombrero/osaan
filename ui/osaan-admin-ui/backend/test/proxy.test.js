import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { fakeUpstream, loadApp } from './helpers.js';

let upstream;
let app;

before(async () => {
  upstream = await fakeUpstream();
  app = await loadApp(upstream.url);
});

after(async () => {
  await app.close();
  await upstream.close();
});

beforeEach(() => {
  upstream.requests.length = 0;
  upstream.reply = { status: 200, body: {} };
});

test('GET /health answers ok', async () => {
  const res = await fetch(`${app.url}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'broken on purpose' });
});

test('GET /api/v1/skills forwards the query to the skill catalog and returns its answer', async () => {
  upstream.reply = { status: 200, body: { content: [{ name: 'java' }], totalElements: 1 } };

  const res = await fetch(`${app.url}/api/v1/skills?query=ja&page=1`);

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { content: [{ name: 'java' }], totalElements: 1 });
  assert.equal(upstream.requests.length, 1);
  assert.equal(upstream.requests[0].method, 'GET');
  assert.equal(upstream.requests[0].url, '/v1/skills?query=ja&page=1');
});

test('POST /api/v1/admin/skills forwards the body and passes the status through', async () => {
  upstream.reply = { status: 201, body: { id: 's1', name: 'kotlin' } };

  const res = await fetch(`${app.url}/api/v1/admin/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'kotlin' }),
  });

  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { id: 's1', name: 'kotlin' });
  assert.equal(upstream.requests[0].method, 'POST');
  assert.equal(upstream.requests[0].url, '/v1/admin/skills');
  assert.deepEqual(upstream.requests[0].body, { name: 'kotlin' });
});

test('a downstream error status reaches the client unchanged', async () => {
  upstream.reply = { status: 409, body: { title: 'Conflict' } };

  const res = await fetch(`${app.url}/api/v1/admin/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'java' }),
  });

  assert.equal(res.status, 409);
  assert.deepEqual(await res.json(), { title: 'Conflict' });
});

test('DELETE /api/v1/admin/skills/:id answers 204 with no body when the catalog does', async () => {
  upstream.reply = { status: 204, body: undefined };

  const res = await fetch(`${app.url}/api/v1/admin/skills/s1`, { method: 'DELETE' });

  assert.equal(res.status, 204);
  assert.equal(await res.text(), '');
  assert.equal(upstream.requests[0].url, '/v1/admin/skills/s1');
});

test('with auth disabled, no bearer token is sent downstream', async () => {
  await fetch(`${app.url}/api/v1/skills`);

  assert.equal(upstream.requests[0].headers.authorization, undefined);
});

test('GET /api/user reports that auth is disabled', async () => {
  const res = await fetch(`${app.url}/api/user`);

  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { authenticated: false, user: null, authDisabled: true });
});
