# Osaan Admin UI - Frontend

React-based admin interface for the Osaan platform.

## Development

### Standard Development (requires backend services)

```bash
npm run dev
```

Runs the app at `http://localhost:5173` and connects to:

- Backend API: `http://localhost:8080`
- Skill Catalog Service: `http://localhost:8082`

### Mock Development (frontend only)

```bash
npm run dev:mock
```

Runs the app with **MSW (Mock Service Worker)** intercepting API requests. Perfect for:

- Frontend-only development
- Working without backend services
- Testing UI with different data scenarios
- Faster development iteration

**Mock Features:**

- ✅ Full authentication flow (mocked)
- ✅ Skill CRUD operations
- ✅ Error scenarios
- ✅ Search & sorting
- ✅ Configurable mock data in `src/test/mocks/data.ts`

### Other Commands

```bash
npm test              # Run tests in watch mode
npm run test:watch    # Same as npm test
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # Lint code
npm run format        # Format code with Prettier
```

## Testing

Tests use the same MSW setup as mock development mode:

```bash
npm test
```

Test files:

- `**/__tests__/*.test.tsx` - Component tests
- Uses MSW for API mocking
- React Testing Library for rendering
- Vitest as test runner

## Mock Data Configuration

To customize mock data for development, edit:

- `src/test/mocks/data.ts` - Mock users, skills, responses
- `src/test/mocks/handlers.ts` - API request handlers

Example: Change default user from admin to regular user:

```typescript
// In handlers.ts
let currentAuthState: AuthState = mockRegularUser; // instead of mockAdminUser
```
