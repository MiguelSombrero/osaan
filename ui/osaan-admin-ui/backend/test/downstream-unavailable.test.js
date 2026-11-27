import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fakeUpstream, loadApp } from './helpers.js';

// Its own file, so its own process: env.js reads TARGET_API once, on import.
let app;

before(async () => {
  const upstream = await fakeUpstream();
  const deadUrl = upstream.url;
  await upstream.close();
  app = await loadApp(deadUrl);
});

after(() => app.close());

test('an unreachable skill catalog answers 503 as problem+json', async () => {
  const res = await fetch(`${app.url}/api/v1/skills`);

  assert.equal(res.status, 503);
  assert.match(res.headers.get('content-type'), /^application\/problem\+json/);
  const problem = await res.json();
  assert.equal(problem.title, 'Service Unavailable');
  assert.equal(problem.instance, '/api/v1/skills');
});
