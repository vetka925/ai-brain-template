#!/usr/bin/env node
// Prints one line per startup file near its context budget, and a reminder when reflections were not reviewed for 30 days. Reports only.
'use strict';
const THRESHOLDS = { budgetRatio: 0.85, reviewDays: 30, checkerTimeoutMs: 10000 };
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const fixes = {
  'log.md': 'run npm run rotate:log',
  'tasks.md': 'archive closed actions; keep next steps and detail links',
  'index.md': 'review navigation for redundant detail',
  'wiki/meta/reflections.md': 'review and archive resolved entries unchanged',
  startup: 'review detail shared across startup pages',
};

function readOptional(root, file) {
  try { return fs.readFileSync(path.join(root, file), 'utf8'); } catch { return ''; }
}

function ageDays(date) {
  if (!date) return null;
  const ms = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== date) return null;
  // Compare calendar dates in UTC, independent of the host's timezone and DST.
  return Math.floor(Date.now() / 86400000) - ms / 86400000;
}

function main() {
  // Unknown/retired modes, including --stop, deliberately do nothing.
  if (process.argv.length !== 3 || process.argv[2] !== '--start') return;
  const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 1000,
  }).trim();
  const result = spawnSync(process.execPath, [path.join(root, 'tools/brain-check.cjs'), '--json'], {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    timeout: THRESHOLDS.checkerTimeoutMs, maxBuffer: 4 * 1024 * 1024,
  });
  // Exit 1 is a valid report containing findings; exit 2 is an invocation failure.
  if (result.error || result.signal || ![0, 1].includes(result.status)) return;
  const report = JSON.parse(result.stdout);
  if (!report.metrics || typeof report.metrics !== 'object' || !Array.isArray(report.errors)) return;
  const lines = [];
  for (const [file, { estimate, limit }] of Object.entries(report.metrics)) {
    if (!Number.isFinite(estimate) || !Number.isFinite(limit) || estimate < 0 || limit <= 0) return;
    if (estimate / limit < THRESHOLDS.budgetRatio) continue;
    const over = estimate > limit ? `, over by ${estimate - limit}` : '';
    lines.push(`${file} at ${Math.round(100 * estimate / limit)}% of budget (${estimate}/${limit}${over}): ${fixes[file] || 'review redundant detail; preserve rules and source evidence'}`);
  }
  const review = readOptional(root, 'wiki/meta/reflections.md')
    .match(/^reviewed:\s*"?(\d{4}-\d{2}-\d{2})"?\s*$/m)?.[1];
  const reviewAge = ageDays(review);
  if (reviewAge > THRESHOLDS.reviewDays) lines.push(`reflections review overdue: last ${review}, ${reviewAge} days ago`);
  if (lines.length) process.stdout.write(lines.join('\n') + '\n');
}

try { main(); } catch { /* Fail open: a maintenance hook must never break a session. */ }
