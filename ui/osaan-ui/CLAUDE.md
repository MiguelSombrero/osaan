# User UI (osaan-ui) — agent conventions

Loaded when you work under `ui/osaan-ui/`. Next.js 15 App Router, React 19.

## Commands

```bash
cd ui/osaan-ui
npm run dev          # http://localhost:3000
npm run type-check
npm run lint
npm test             # Vitest
npm run build
```

## Structure

- Routes under `src/app/` (`page.tsx`, `layout.tsx`, nested); API route handlers under `src/app/api/` proxy to the microservices
- Auth: NextAuth 4 with Keycloak — `src/lib/auth.ts`, `src/middleware.ts`, `src/types/next-auth.d.ts`
- Shared components in `src/components/`; hooks in `src/hooks/`
- TanStack Query wired in `src/providers/query-provider.tsx`
- Tailwind CSS for styling; i18next for text
- Server Components by default; mark client components with `'use client'`
- Validation: Zod schemas in `src/lib/validation/schemas/` (one file per
  domain type), used by both API route handlers and forms (`react-hook-form`
  + `@hookform/resolvers`). `src/lib/validation/i18n-error-map.ts` turns Zod
  issues into user-facing text, resolving i18n keys in this order:
  `validation.fields.<field>.<code>` → `validation.custom.<message>` →
  `validation.codes.<code>` → `validation.generic`. Add matching keys to
  `public/locales/{en,fi}.json`.

## Testing

Vitest + Testing Library + MSW. Test files live in `src/**/__tests__/`.

- **Custom hooks** — `renderHook` with a real `QueryClient` (no retries, no cache time)
- **Client components** — `renderWithProviders()` from `src/test/renderWithProviders.tsx`
- **Pure utility functions** — plain unit tests
- **Zod schemas** — plain unit tests per schema, in `src/lib/validation/__tests__/`
- Mock HTTP with MSW handlers in `src/test/mocks/handlers.ts`; add a handler for each new endpoint
- **Skip:** Server Components, NextAuth internals

**API route handlers** (`src/app/api/**/route.ts`) own request validation, so
their tests pin it down. Follow `src/app/api/skills/__tests__/route.test.ts`:

- Import the handler (`import { GET } from '../route'`) and call it — no HTTP server, no MSW
- Stub upstream with `vi.mock('@/lib/server-api', () => ({ fetchWithAuth: vi.fn() }))`; `vi.mocked(fetchWithAuth).mockReset()` in `beforeEach`
- Build the request by hand: `new NextRequest(url, { method, body })`
- Dynamic segments are the second argument, with **async params**: `{ params: Promise.resolve({ employeeId: 'e1' }) }`
- Per endpoint: valid input forwards upstream with the expected path and method (`expect.objectContaining`); each invalid input returns 400 **and** leaves `fetchWithAuth` uncalled
