# Common failures and gotchas

One row per failure, added when it happens: what you see, why, and what
fixes it. Newest at the bottom. A row whose cause is gone is deleted in the
task that removes the cause.

| Symptom | Cause | Fix |
|---|---|---|
| `npm run lint` in `ui/osaan-admin-ui/frontend` or `backend`: "ESLint couldn't find an eslint.config.(js\|mjs\|cjs) file" | ESLint 9 reads only flat config; the packages still have `.eslintrc.cjs` | Until [iteration 0 task 03](tasks/iteration-0/03-verify-gate-and-pr-ci.md) adds flat config, lint cannot run there |
| Admin UI `npm run build` or `SkillForm`/`SkillList` tests: `Could not resolve "./generated/skills"` | The generated API clients are not committed, and only CI runs `npm run generate:client` | Run `npm run generate:client` first (needs Java), until task 03 commits the clients |
| `npm test` in `ui/osaan-admin-ui/backend`: `jest: command not found` | The script calls Jest, which is not a dependency, and there are no tests | Nothing to run until task 03 adds a test runner |
| `testkube-minio-testkube` in `ImagePullBackOff`: `pull access denied, repository does not exist` for `docker.io/minio/minio` | Docker Hub removed the `minio/minio` repository; Testkube chart 2.9.5 still points at it | `setup-cluster.sh` pins the drop-in fork `pgsty/minio` (`TESTKUBE_MINIO_*`). Testkube's own `kubeshop/testkube-minio` does not work with chart 2.9.5: it crash-loops with `exec: server: not found` |
