import { createServer } from 'node:http';

// Starts an HTTP server on a free port and returns its base URL.
export function listen(server) {
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve(`http://127.0.0.1:${port}`);
    });
  });
}

// A stand-in for skill-catalog-service that records every request it gets
// and answers with whatever the test sets in `reply`.
export async function fakeUpstream() {
  const upstream = {
    requests: [],
    reply: { status: 200, body: {} },
  };
  const server = createServer((req, res) => {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      upstream.requests.push({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: raw ? JSON.parse(raw) : undefined,
      });
      const { status, body } = upstream.reply;
      res.writeHead(status, body === undefined ? {} : { 'Content-Type': 'application/json' });
      res.end(body === undefined ? undefined : JSON.stringify(body));
    });
  });
  upstream.url = await listen(server);
  upstream.close = () => new Promise(resolve => server.close(resolve));
  return upstream;
}

// Imports the Express app with auth and Redis off and TARGET_API set, the way
// the backend runs in development. env.js reads the environment on import.
export async function loadApp(targetApi) {
  process.env.NODE_ENV = 'test';
  process.env.KEYCLOAK_ENABLED = 'false';
  process.env.REDIS_ENABLED = 'false';
  process.env.TARGET_API = targetApi;
  const { app } = await import('../src/server.js');
  const server = createServer(app);
  const url = await listen(server);
  return { url, close: () => new Promise(resolve => server.close(resolve)) };
}
