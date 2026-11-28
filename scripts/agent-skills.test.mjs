import assert from 'node:assert/strict';
import { realpathSync } from 'node:fs';
import { test } from 'node:test';

for (const skill of ['implement-task', 'refine-iteration', 'upgrade-component']) {
  test(`both harnesses load the same ${skill} procedure`, () => {
    const entry = `${skill}/SKILL.md`;
    assert.equal(
      realpathSync(new URL(`../.agents/skills/${entry}`, import.meta.url)),
      realpathSync(new URL(`../.claude/skills/${entry}`, import.meta.url)),
    );
  });
}
