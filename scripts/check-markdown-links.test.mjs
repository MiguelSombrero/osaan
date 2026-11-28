import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const checker = fileURLToPath(new URL('./check-markdown-links.mjs', import.meta.url));

function fixture(t, files) {
  const root = mkdtempSync(join(tmpdir(), 'osaan-markdown-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  for (const [name, contents] of Object.entries(files)) {
    const path = join(root, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents);
  }
  execFileSync('git', ['add', '--', '.'], { cwd: root });
  return { root, check: () => spawnSync(process.execPath, [checker, root], { encoding: 'utf8' }) };
}

test('checks tracked Markdown links and anchors, excluding generated and untracked sources', (t) => {
  const { root, check } = fixture(t, {
    'README.md': [
      '# Welcome **home**',
      '[here](#welcome-home) and [top](#)',
      '[docs](docs/), [root](/docs/Guide%20one.md#start-here-1)',
      '[nested [label]](<docs/Guide one.md#café> "Guide")',
      '[setext][guide]',
      '[guide]: docs/Guide%20one.md#setup',
      '![image](docs/logo.png)',
      '[example](https://example.invalid/missing) and [contact](mailto:test@example.org)',
      '`[code](missing.md)`',
      '<!-- [comment](missing.md) -->',
      '~~~markdown',
      '[template](missing.md)',
      '~~~',
      '',
    ].join('\n'),
    'docs/Guide one.md': [
      '# Start here',
      '# Start here',
      '## Café',
      'Setup',
      '-----',
      '<a id="custom"></a>',
      '[custom](#custom) and [back](../README.md#welcome-home)',
      '',
    ].join('\n'),
    'docs/logo.png': '',
    'ui/osaan-admin-ui/frontend/src/api/generated/skills/docs/PublicSkillsApi.md': '[generated](missing.md)\n',
  });
  writeFileSync(join(root, 'untracked.md'), '[untracked](missing.md)\n');
  const result = check();
  assert.equal(result.status, 0, result.stderr);
});

test('exits nonzero and identifies broken paths, images, references and fragments', (t) => {
  const { check } = fixture(t, {
    'README.md': [
      '# Home',
      '[missing](docs/deleted.md#intro)',
      '[bad heading](docs/guide.md#gone)',
      '![missing](docs/deleted.png)',
      '[reference][ref]',
      '[ref]: docs/missing.md "Example"',
      '[local](#absent)',
      '[![missing](docs/badge.png)](docs/guide.md#intro)',
      '',
    ].join('\n'),
    'docs/guide.md': '# Intro\n',
  });
  const result = check();
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /README\.md:2:.*docs\/deleted\.md#intro/);
  assert.match(result.stderr, /README\.md:3:.*docs\/guide\.md#gone/);
  assert.match(result.stderr, /README\.md:4:.*docs\/deleted\.png/);
  assert.match(result.stderr, /README\.md:6:.*docs\/missing\.md/);
  assert.match(result.stderr, /README\.md:7:.*#absent/);
  assert.match(result.stderr, /README\.md:8:.*docs\/badge\.png/);
});
