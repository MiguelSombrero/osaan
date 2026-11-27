# Iteration 3 — User UI

Goal: osaan-ui runs on current Next.js, Tailwind and authentication, and
its main user flows are covered end to end.

## Done when

Written at refinement.

## Tasks

Planned, one line each. Task files are written when this iteration is
refined.

1. **e2e coverage first:** Playwright tests for sign-in, browsing skills,
   editing a competence profile and creating a subscription, so the
   upgrades below are verified against them.
2. **Next.js 15 → 16**, `eslint-config-next` to match. Next 16 renames
   `middleware.ts` to `proxy.ts` and postdates model training: read the
   docs shipped in `node_modules/next/dist/docs/`, never memory.
3. **Authentication:** NextAuth 4 → its maintained successor, or another
   current option — decided at refinement.
4. **Tailwind CSS 3 → 4.**
5. **One Redis client:** `redis` 4 and `@upstash/redis` are both
   dependencies; keep one, at its current version.
