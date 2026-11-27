#!/usr/bin/env node
// Checks docs/tasks/ against docs/tasks/template.md.
// Usage: node scripts/check-tasks.mjs [tasks-dir]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const STATUSES = ['needs-refinement', 'refined', 'in-progress', 'done', 'dropped'];
const SECTIONS = ['Why', 'Scope', 'Constraints', 'Open questions', 'Acceptance criteria'];
const PAST_REFINEMENT = ['refined', 'in-progress', 'done'];
const AUTOMATED_TEST = /\btest|make verify/i;

function sectionsOf(text) {
  const sections = [];
  let current = null;
  for (const line of text.split('\n')) {
    const heading = line.match(/^## (.+?)\s*$/);
    if (heading) {
      current = { name: heading[1], body: [] };
      sections.push(current);
    } else if (current) {
      current.body.push(line);
    }
  }
  return sections.map(({ name, body }) => ({ name, body: body.join('\n').trim() }));
}

function metaValue(text, key) {
  const match = text.match(new RegExp(`^- \\*\\*${key}:\\*\\* (.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

function parseTask(file, text) {
  const errors = [];
  const fileId = file.match(/^(\d+)-/)?.[1];
  const heading = text.match(/^# Task (\d+): (.+)$/m);
  if (!heading) {
    errors.push('missing "# Task NN: Title" heading');
  } else if (heading[1] !== fileId) {
    errors.push(`heading says task ${heading[1]}, file name says ${fileId}`);
  }

  const status = metaValue(text, 'Status');
  if (!status) errors.push('missing "Status"');
  else if (!STATUSES.includes(status)) errors.push(`invalid status "${status}"`);

  const sections = sectionsOf(text);
  const names = sections.map((s) => s.name);
  for (const name of names) {
    if (!SECTIONS.includes(name)) errors.push(`unknown section "${name}"`);
  }
  for (const name of SECTIONS) {
    if (!names.includes(name)) errors.push(`missing section "${name}"`);
  }
  const known = names.filter((n) => SECTIONS.includes(n));
  const expected = SECTIONS.filter((n) => known.includes(n));
  if (known.join('|') !== expected.join('|')) errors.push('sections out of order');

  const body = (name) => sections.find((s) => s.name === name)?.body ?? '';
  const criteria = body('Acceptance criteria')
    .split('\n')
    .filter((line) => /^- \[[ x]\]/.test(line));

  if (PAST_REFINEMENT.includes(status)) {
    if (body('Open questions') !== '**None.**') {
      errors.push('open questions must be "**None.**" once refined');
    }
    if (!criteria.some((line) => AUTOMATED_TEST.test(line))) {
      errors.push('no acceptance criterion names an automated test');
    }
  }
  if (status === 'done' && criteria.some((line) => line.startsWith('- [ ]'))) {
    errors.push('done but has unticked acceptance criteria');
  }

  const coversLine = metaValue(text, 'Covers');
  const covers = coversLine && coversLine !== 'none' ? coversLine.split(/,\s*/) : [];
  return { id: fileId, title: heading?.[2].trim(), status, coversLine, covers, errors };
}

function parseIteration(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    const row = line.match(/^\| \[(\d+)\]\(([^)]+)\) \| (.+?) \| (\S+) \|$/);
    if (row) rows.push({ id: row[1], path: row[2], title: row[3], status: row[4] });
  }
  const doneWhen = [...text.matchAll(/^- \*\*(DW-\d+):\*\*/gm)].map((m) => m[1]);
  return { rows, doneWhen };
}

function checkIteration(tasksDir, name) {
  const errors = [];
  const iterationPath = join(tasksDir, name);
  const taskDir = iterationPath.replace(/\.md$/, '');
  if (!existsSync(taskDir)) return errors;

  const { rows, doneWhen } = parseIteration(readFileSync(iterationPath, 'utf8'));
  const tasks = new Map();
  for (const file of readdirSync(taskDir).filter((f) => f.endsWith('.md')).sort()) {
    const task = parseTask(file, readFileSync(join(taskDir, file), 'utf8'));
    tasks.set(file, task);
    const where = relative(tasksDir, join(taskDir, file));
    errors.push(...task.errors.map((e) => `${where}: ${e}`));
    if (doneWhen.length > 0) {
      if (!task.coversLine) errors.push(`${where}: missing "Covers"`);
      for (const id of task.covers) {
        if (!doneWhen.includes(id)) errors.push(`${where}: covers unknown ${id}`);
      }
    }
  }

  const rowFiles = new Set();
  for (const row of rows) {
    const file = row.path.split('/').pop();
    rowFiles.add(file);
    const task = tasks.get(file);
    if (!task) {
      errors.push(`${name}: row ${row.id} links to a missing file ${row.path}`);
      continue;
    }
    if (row.title !== task.title) {
      errors.push(`${name}: row ${row.id} title "${row.title}" differs from the file's "${task.title}"`);
    }
    if (row.status !== task.status) {
      errors.push(`${name}: row ${row.id} status "${row.status}" differs from the file's "${task.status}"`);
    }
  }
  for (const file of tasks.keys()) {
    if (!rowFiles.has(file)) errors.push(`${name}: ${file} has no row in the task table`);
  }

  const live = [...tasks.values()].filter((t) => t.status !== 'dropped');
  for (const id of doneWhen) {
    if (!live.some((t) => t.covers.includes(id))) errors.push(`${name}: ${id} is covered by no live task`);
  }
  return errors;
}

export function checkTasks(tasksDir) {
  return readdirSync(tasksDir)
    .filter((f) => /^iteration-\d+\.md$/.test(f))
    .sort()
    .flatMap((name) => checkIteration(tasksDir, name));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const defaultDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'tasks');
  const errors = checkTasks(process.argv[2] ?? defaultDir);
  for (const error of errors) console.error(error);
  if (errors.length > 0) process.exit(1);
  console.log('docs/tasks: OK');
}
