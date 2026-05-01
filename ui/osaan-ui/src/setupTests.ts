import '@testing-library/jest-dom';
import { setupMswServer } from './test/mocks/server';

setupMswServer();

// Suppress unhandled rejection noise from React Query in error-scenario tests
const originalListeners = process.listeners('unhandledRejection');
process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', (reason: unknown) => {
  if (reason instanceof Error && reason.name === 'ApiError') return;
  originalListeners.forEach((listener) => {
    if (typeof listener === 'function') listener(reason, Promise.reject(reason));
  });
});
