# Iteration 2 — Admin UI

Goal: the admin UI and its Express backend run on current React, MUI and
Vite, the backend is tested for the first time, and the admin UI is verified
working in k3d.

## Done when

Written at refinement.

## Tasks

Planned, one line each. Task files are written when this iteration is
refined.

1. **Admin backend tests and upgrades:** a real test suite first (routes,
   auth middleware, proxying), then OpenTelemetry 1.x → 2.x,
   express-openid-connect 2 → 3 and redis 5 → 6. Also check whether tracing
   now reaches Jaeger (old TODO).
2. **React 18 → 19** in the admin frontend.
3. **MUI 7 → 9**, one major at a time.
4. **Vite 7 → 8, Vitest 3 → 5, ESLint 9 → 10.**
5. **Admin UI moves to Orval** (decided at iteration 0 refinement): types,
   client, TanStack Query hooks and MSW mocks generated from the specs the
   services export (iteration 1 task 7), committed. The hand-written API
   wrappers, hooks and test mocks they replace are removed.
6. **Admin UI e2e in k3d:** a Playwright test that signs in as `anna` and
   manages a skill, run by Testkube (old TODO "is osaan-admin-ui working in
   k3d?").
