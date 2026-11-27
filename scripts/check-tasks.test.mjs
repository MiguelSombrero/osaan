import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkTasks } from './check-tasks.mjs';

const repoTasksDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'tasks');

function taskFile({
  id = '01',
  title = 'Do the thing',
  status = 'refined',
  covers = 'DW-1',
  sections,
  openQuestions = '**None.**',
  criteria = '- [ ] `npm test` covers the thing',
} = {}) {
  const body = sections ?? [
    ['Why', 'Because.'],
    ['Scope', 'The thing.'],
    ['Constraints', '**None.**'],
    ['Open questions', openQuestions],
    ['Acceptance criteria', criteria],
  ];
  const meta = [
    `- **Status:** ${status}`,
    '- **Iteration:** [0](../iteration-0.md)',
    covers === null ? null : `- **Covers:** ${covers}`,
  ].filter(Boolean);
  return [
    `# Task ${id}: ${title}`,
    '',
    ...meta,
    '',
    ...body.flatMap(([heading, text]) => [`## ${heading}`, '', text, '']),
  ].join('\n');
}

function iterationFile(rows, doneWhen = ['- **DW-1:** something runs']) {
  return [
    '# Iteration 0 — Test',
    '',
    'Goal: test.',
    '',
    '## Done when',
    '',
    ...doneWhen,
    '',
    '## Tasks',
    '',
    '| ID | Task | Status |',
    '|---|---|---|',
    ...rows.map(
      ([id, slug, title, status]) => `| [${id}](iteration-0/${id}-${slug}.md) | ${title} | ${status} |`,
    ),
    '',
  ].join('\n');
}

function fixture({ iteration, tasks }) {
  const dir = mkdtempSync(join(tmpdir(), 'check-tasks-'));
  writeFileSync(join(dir, 'iteration-0.md'), iteration);
  mkdirSync(join(dir, 'iteration-0'));
  for (const [name, text] of Object.entries(tasks)) {
    writeFileSync(join(dir, 'iteration-0', name), text);
  }
  return dir;
}

function run(spec) {
  const dir = fixture(spec);
  try {
    return checkTasks(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const validRow = ['01', 'thing', 'Do the thing', 'refined'];

test('a valid iteration has no errors', () => {
  assert.deepEqual(
    run({ iteration: iterationFile([validRow]), tasks: { '01-thing.md': taskFile() } }),
    [],
  );
});

test('the repository docs/tasks passes', () => {
  assert.deepEqual(checkTasks(repoTasksDir), []);
});

test('a missing section is an error', () => {
  const sections = [
    ['Why', 'Because.'],
    ['Scope', 'The thing.'],
    ['Open questions', '**None.**'],
    ['Acceptance criteria', '- [ ] `npm test` passes'],
  ];
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ sections }) },
  });
  assert.match(errors.join('\n'), /missing section "Constraints"/);
});

test('sections out of order are an error', () => {
  const sections = [
    ['Scope', 'The thing.'],
    ['Why', 'Because.'],
    ['Constraints', '**None.**'],
    ['Open questions', '**None.**'],
    ['Acceptance criteria', '- [ ] `npm test` passes'],
  ];
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ sections }) },
  });
  assert.match(errors.join('\n'), /sections out of order/);
});

test('an unknown section is an error', () => {
  const sections = [
    ['Why', 'Because.'],
    ['Scope', 'The thing.'],
    ['Design', 'A long design.'],
    ['Constraints', '**None.**'],
    ['Open questions', '**None.**'],
    ['Acceptance criteria', '- [ ] `npm test` passes'],
  ];
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ sections }) },
  });
  assert.match(errors.join('\n'), /unknown section "Design"/);
});

test('a refined task with open questions is an error', () => {
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ openQuestions: '- Which colour?' }) },
  });
  assert.match(errors.join('\n'), /open questions must be "\*\*None\.\*\*"/);
});

test('a needs-refinement task may have open questions', () => {
  const errors = run({
    iteration: iterationFile([['01', 'thing', 'Do the thing', 'needs-refinement']]),
    tasks: {
      '01-thing.md': taskFile({ status: 'needs-refinement', openQuestions: '- Which colour?' }),
    },
  });
  assert.deepEqual(errors, []);
});

test('an invalid status is an error', () => {
  const errors = run({
    iteration: iterationFile([['01', 'thing', 'Do the thing', 'ready']]),
    tasks: { '01-thing.md': taskFile({ status: 'ready' }) },
  });
  assert.match(errors.join('\n'), /invalid status "ready"/);
});

test('a refined task without an automated-test criterion is an error', () => {
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ criteria: '- [ ] It looks nice in a browser' }) },
  });
  assert.match(errors.join('\n'), /no acceptance criterion names an automated test/);
});

test('a done task with an unticked criterion is an error', () => {
  const errors = run({
    iteration: iterationFile([['01', 'thing', 'Do the thing', 'done']]),
    tasks: { '01-thing.md': taskFile({ status: 'done' }) },
  });
  assert.match(errors.join('\n'), /done but has unticked acceptance criteria/);
});

test('a row without a file and a file without a row are errors', () => {
  const errors = run({
    iteration: iterationFile([['02', 'other', 'Other', 'refined']]),
    tasks: { '01-thing.md': taskFile() },
  });
  const text = errors.join('\n');
  assert.match(text, /row 02 links to a missing file/);
  assert.match(text, /01-thing\.md has no row/);
});

test('a row whose title or status differs from the file is an error', () => {
  const errors = run({
    iteration: iterationFile([['01', 'thing', 'Old title', 'needs-refinement']]),
    tasks: { '01-thing.md': taskFile() },
  });
  const text = errors.join('\n');
  assert.match(text, /title "Old title" differs from the file's "Do the thing"/);
  assert.match(text, /status "needs-refinement" differs from the file's "refined"/);
});

test('a heading number that differs from the file name is an error', () => {
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ id: '07' }) },
  });
  assert.match(errors.join('\n'), /heading says task 07/);
});

test('covering an unknown Done when id is an error', () => {
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ covers: 'DW-1, DW-9' }) },
  });
  assert.match(errors.join('\n'), /covers unknown DW-9/);
});

test('a Done when id no live task covers is an error', () => {
  const errors = run({
    iteration: iterationFile([validRow], ['- **DW-1:** a', '- **DW-2:** b']),
    tasks: { '01-thing.md': taskFile() },
  });
  assert.match(errors.join('\n'), /DW-2 is covered by no live task/);
});

test('a missing Covers line is an error when the iteration has Done when ids', () => {
  const errors = run({
    iteration: iterationFile([validRow]),
    tasks: { '01-thing.md': taskFile({ covers: null }) },
  });
  assert.match(errors.join('\n'), /missing "Covers"/);
});
