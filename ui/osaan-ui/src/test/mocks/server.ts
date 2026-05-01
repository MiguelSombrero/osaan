import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { handlers, resetMocks } from './handlers';

export const server = setupServer(...handlers);

export function setupMswServer() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => {
    server.resetHandlers();
    resetMocks();
  });
  afterAll(() => server.close());
}
