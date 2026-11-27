# Admin UI — agent conventions

Loaded when you work under `ui/osaan-admin-ui/`. A React + TypeScript SPA
(Vite) in `frontend/`, with a Node/Express backend proxy in `backend/`.

## Commands

```bash
cd ui/osaan-admin-ui/frontend && npm run dev:mock        # frontend on MSW mocks, http://localhost:5173
cd ui/osaan-admin-ui && npm run dev                      # frontend + Express backend
cd ui/osaan-admin-ui/frontend && npm run generate:client # regenerate OpenAPI clients
cd ui/osaan-admin-ui/frontend && npm test
cd ui/osaan-admin-ui/frontend && npm run lint            # zero-warning policy
cd ui/osaan-admin-ui/frontend && npm run format
```

## Structure

- Route-level screens in `src/pages/`; domain areas under `src/<domain>/`; shared UI in `src/components/`
- OpenAPI-generated HTTP clients in `src/api/generated/` are committed: after a spec change run `npm run generate:client` and commit the result; never hand-edit them (`make verify` fails on any drift)
- TanStack Query for server state; Zustand for UI state
- MUI + Emotion for components; theme in `src/theme.ts`
- i18next for all UI text (`src/i18n.ts`)
- MSW mocks the API in development (`npm run dev:mock`)

## Testing (`frontend/`)

Vitest + Testing Library. Follow `src/skill/components/__tests__/` and
`src/skill/hooks/__tests__/`.

- Render components with `renderWithProviders()` from `src/test/utils/renderWithProviders.tsx`
- Control API responses with the `setMock*()` helpers and `server.use()` overrides from `src/test/mocks/`
- Test rendering, user interactions, error states, loading states and role-based visibility
- Use `@testing-library/user-event`, not `fireEvent`
