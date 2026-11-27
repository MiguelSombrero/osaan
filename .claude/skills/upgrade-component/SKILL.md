---
name: upgrade-component
description: Numbered procedure for upgrading one Osaan component (a framework, library, runtime, container image, Helm chart or cluster add-on) to its current stable version — finding the real latest version, reading the release notes and migration guide for every version crossed, one major (Istio — one minor) at a time, proving it with tests that ran before and after, and logging surprises. Invoke inside implement-task whenever a version number changes.
---

# Upgrade a component

Runs inside `implement-task`, at its "test first" step. It never replaces
that skill's gates.

## Procedure

1. **Find the versions, never from memory.** Current: the pom, `package.json`,
   Dockerfile, chart or script pin. Latest stable:
   - npm: `npm view <pkg> version`
   - Maven: `curl -s https://repo1.maven.org/maven2/<group/path>/<artifact>/maven-metadata.xml`
   - GitHub releases: `gh api repos/<owner>/<repo>/releases/latest --jq .tag_name`
   - runtimes: the current LTS (endoflife.date)

   The target is the latest stable unless the task's Constraints say
   otherwise. A release candidate, beta or milestone is never a target.
2. **Plan the steps.** List every major version between current and target
   (for Istio and Kubernetes add-ons with a skew policy, every minor). Each
   step is its own commit, green before the next.
3. **Read before changing.** For each version crossed, read its release notes
   and migration guide. Search the repository for every API, config key and
   flag the guide changes or removes, and note each hit. If a version
   postdates your training (Next.js 16, recent Expo, Spring Boot 4.x),
   follow the docs shipped with the package or the official site, never
   memory.
4. **Baseline.** Run the tests that cover the component and record the
   result. If nothing would catch a break the guide warns about, first add a
   test for that behaviour, and see it pass on the old version.
5. **Bump one step.** Change the version where it is pinned, the lockfile
   included (`npm install <pkg>@<version>`, never hand-edited). Keep peer
   dependencies aligned (`@types/*`, plugins, BOMs). When k3d and Docker
   Compose pin the same component, both move in this commit.
6. **Fix what broke**, following the migration guide rather than
   workarounds. No new deprecation warnings: compiler, npm and runtime.
7. **Prove it.** The baseline tests pass again, then `make verify`. A
   deployable component also runs `make cluster-verify`. For a Helm chart,
   compare `helm template` output before and after, and explain each
   difference in the commit body.
8. **Log surprises.** Anything the guide did not warn about, or that cost
   time, becomes a row in `docs/common-failures.md` now.
9. **Commit** "Upgrade <component> <from> → <to>". The body lists the
   breaking changes handled and links the release notes.
