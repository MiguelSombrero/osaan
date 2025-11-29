import '@testing-library/jest-dom';
import { setupMswServer } from './test/mocks/server';

// Setup MSW server lifecycle (beforeAll, afterEach, afterAll)
setupMswServer();

// Mock window.location for login/logout tests
// Store original location to restore parts of it
const originalLocation = window.location;

const locationMock = {
  ...originalLocation,
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  href: 'http://localhost:3000/',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
};

Object.defineProperty(window, 'location', {
  value: locationMock,
  writable: true,
  configurable: true,
});

// Reset location mock before each test
beforeEach(() => {
  locationMock.assign.mockClear();
  locationMock.replace.mockClear();
  locationMock.href = 'http://localhost:3000/';
  locationMock.pathname = '/';
  locationMock.search = '';
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});
