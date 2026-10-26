#!/usr/bin/env node
// Moves the oldest log.md entries unchanged into log-archive/YYYY-MM.md until log.md fits its budget.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { budgets, estimate } = require('./brain-check.cjs');

const HEADER = '# AI Brain log\n\n';
const ENTRY = /^(\d{4}-\d{2})-\d{2} — /;

function main() {
  const args = process.argv.slice(2);
  let limit = budgets['log.md'];
  if (args[0] === '--limit' && Number(args[1]) > 0) limit = Number(args[1]);
  else if (args.length) throw new Error('usage: rotate-log.cjs [--limit <estimate>]');
  const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const logPath = path.join(root, 'log.md');
  const text = fs.readFileSync(logPath, 'utf8');
  if (!text.startsWith(HEADER)) throw new Error('log.md header not recognized');
  const paragraphs = text.slice(HEADER.length).replace(/\n+$/, '').split(/\n\n+/);
  const footer = paragraphs.length && /^\[Earlier entries\]\(log-archive\/\d{4}-\d{2}\.md\)\.$/.test(paragraphs.at(-1)) ? paragraphs.pop() : null;
  // A paragraph without a date continues the entry above it (agents sometimes write two-paragraph entries): it moves
  // with that entry, unchanged.
  const blocks = [];
  for (const p of paragraphs) {
    if (ENTRY.test(p)) blocks.push(p);
    else if (blocks.length) blocks[blocks.length - 1] += `\n\n${p}`;
    else throw new Error('log.md entries not recognized');
  }
  if (!blocks.length) throw new Error('log.md entries not recognized');
  const render = (kept, foot) => `${HEADER}${kept.join('\n\n')}\n\n${foot ? foot + '\n' : ''}`;
  const kept = [...blocks], moved = [];
  let foot = footer;
  while (kept.length > 1 && estimate(render(kept, foot)) > limit) {
    moved.unshift(kept.pop());
    foot = `[Earlier entries](log-archive/${moved[0].match(ENTRY)[1]}.md).`;
  }
  if (!moved.length) return;
  // Group by month, preserving newest-first order, and insert above older archived entries.
  const months = new Map();
  for (const e of moved) {
    const m = e.match(ENTRY)[1];
    if (!months.has(m)) months.set(m, []);
    months.get(m).push(e);
  }
  const writes = [];
  for (const [month, entries] of months) {
    const file = path.join(root, 'log-archive', `${month}.md`);
    const head = `# AI Brain log — ${month}\n\n`;
    const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : head;
    if (!old.startsWith(head)) throw new Error(`log-archive/${month}.md header not recognized`);
    const rest = old.slice(head.length).replace(/^\n+/, '');
    writes.push([file, `${head}${entries.join('\n\n')}\n${rest ? '\n' + rest : ''}`]);
  }
  fs.mkdirSync(path.join(root, 'log-archive'), { recursive: true });
  for (const [file, content] of writes) fs.writeFileSync(file, content);
  fs.writeFileSync(logPath, render(kept, foot));
  console.log(`Moved ${moved.length} log entries to ${[...months.keys()].map(m => `log-archive/${m}.md`).join(', ')}.`);
}

try { main(); } catch (error) { console.error(error.message); process.exitCode = 2; }
