#!/usr/bin/env node
// Usage: node scripts/check-markdown-links.mjs [repository-root]
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const markdown = /\.md$/i;
const generatedOpenApi = 'ui/osaan-admin-ui/frontend/src/api/generated/';
const destination = String.raw`(?:<([^<>\n]*)>|((?:\\[^\n]|[^\s()\\]|\([^()\s]*\))*))`;
const label = String.raw`((?:\\[^\n]|[^\[\]\\]|\[[^\[\]]*\])*)`;
const title = String.raw`(?:\s+(?:"[^"\n]*"|'[^'\n]*'|\([^()\n]*\)))?`;
const inline = String.raw`(?<!\\)\[${label}\]\(\s*${destination}${title}\s*\)`;
const inlineLink = new RegExp(inline, 'g');
// Look ahead to also see the image inside a clickable image.
const inlineTargets = new RegExp('(?=' + inline + ')', 'g');
const definition = new RegExp(String.raw`^ {0,3}\[([^\]\n]+)\]:[ \t]*${destination}${title}[ \t]*(?=\r?$)`, 'gm');

function withoutFences(text) {
  let fence;
  return text.split(/\r?\n/).map((line) => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker?.[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) {
        fence = undefined;
      }
      return '';
    }
    if (!marker) return line;
    fence = marker[1];
    return '';
  }).join('\n');
}

function anchors(text) {
  const ids = new Set();
  const headings = new Set();
  const lines = text.split('\n');
  for (const [index, line] of lines.entries()) {
    const atx = line.match(/^ {0,3}#{1,6}[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/);
    const setext = /^ {0,3}(?:=+|-+)[ \t]*$/.test(lines[index + 1] ?? '');
    const heading = atx?.[1] ?? (setext ? line.trim() : '');
    if (!heading) continue;
    const base = heading
      .replace(inlineLink, '$1')
      .replace(/<[^>]+>|&(?:#\w+|\w+);/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}_ -]/gu, '')
      .replace(/ /g, '-');
    let id = base;
    for (let count = 1; headings.has(id); count++) id = base + '-' + count;
    headings.add(id);
  }
  for (const match of text.matchAll(/<[a-z][^<>]*?\s(?:id|name)=["']([^"']+)["'][^<>]*>/gi)) {
    ids.add(match[1]);
  }
  return new Set([...ids, ...headings]);
}

function document(text) {
  const prose = withoutFences(text).replace(/<!--[\s\S]*?(?:-->|$)/g, (comment) => comment.replace(/[^\n]/g, ' '));
  const source = prose.replace(/(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g, (code) => code.replace(/[^\n]/g, ' '));
  const links = [...source.matchAll(inlineTargets), ...source.matchAll(definition)]
    .sort((a, b) => a.index - b.index)
    .map((match) => ({ target: match[2] ?? match[3], line: source.slice(0, match.index).split('\n').length }));
  return { links, anchors: anchors(prose) };
}

function check(root) {
  const output = execFileSync('git', ['ls-files', '-z'], {
    cwd: root,
    encoding: 'utf8',
  });
  const files = new Set(output.split('\0').filter(Boolean));
  const docs = new Map();
  for (const file of files) {
    if (!markdown.test(file) || file.startsWith(generatedOpenApi)) continue;
    const path = resolve(root, file);
    if (statSync(path, { throwIfNoEntry: false })?.isFile()) {
      docs.set(path, document(readFileSync(path, 'utf8')));
    }
  }

  const errors = [];
  for (const [file, { links }] of docs) {
    for (const { target, line } of links) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue;
      const where = relative(root, file) + ':' + line;
      const [, rawPath, rawFragment = ''] = target.match(/^([^?#]*)(?:\?[^#]*)?(?:#(.*))?$/);
      let path;
      let fragment;
      try {
        path = decodeURIComponent(rawPath.replace(/\\([()])/g, '$1'));
        fragment = decodeURIComponent(rawFragment);
      } catch {
        errors.push(where + ': invalid URL encoding in ' + target);
        continue;
      }
      const resolved = path.startsWith('/') ? resolve(root, path.slice(1)) : path ? resolve(dirname(file), path) : file;
      const repoPath = relative(root, resolved);
      const withinRepo = repoPath !== '..' && !repoPath.startsWith('..' + sep) && !isAbsolute(repoPath);
      const stat = withinRepo && statSync(resolved, { throwIfNoEntry: false });
      if (!stat || (!stat.isDirectory() && !files.has(repoPath))) {
        errors.push(where + ': missing link target ' + target);
      } else if (fragment && docs.has(resolved) && !docs.get(resolved).anchors.has(fragment)) {
        errors.push(where + ': missing anchor in ' + target);
      }
    }
  }
  return { errors, count: docs.size };
}

const root = resolve(process.argv[2] ?? fileURLToPath(new URL('..', import.meta.url)));
const { errors, count } = check(root);
for (const error of errors) console.error(error);
if (errors.length > 0) process.exitCode = 1;
else console.log('Markdown links: OK (' + count + ' files)');
