const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const cli = path.resolve(__dirname, '../rotate-log.cjs');
function fixture(t, files) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'rotate-log-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  execFileSync('git', ['init', '-q', cwd]);
  for (const [name, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(cwd, name)), { recursive: true });
    fs.writeFileSync(path.join(cwd, name), text);
  }
  const read = name => fs.readFileSync(path.join(cwd, name), 'utf8');
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
  return { cwd, read, run };
}
const entry = (date, n) => `${date} — meta(e${n}) [request: owner; author model: m] — ${'я'.repeat(n)}`;
const log = (entries, footer = '[Earlier entries](log-archive/2026-08.md).') => `# AI Brain log\n\n${entries.join('\n\n')}\n\n${footer}\n`;
test('within budget nothing changes', t => {
  const text = log([entry('2026-10-02', 5), entry('2026-09-30', 5)]);
  const f = fixture(t, { 'log.md': text });
  const r = f.run(); assert.equal(r.status, 0, r.stderr);
  assert.equal(f.read('log.md'), text);
  assert.ok(!fs.existsSync(path.join(f.cwd, 'log-archive/2026-10.md')));
});
test('moves oldest entries unchanged into monthly archives, newest first, until the log fits', t => {
  const e1 = entry('2026-10-03', 600), e2 = entry('2026-10-02', 600), e3 = entry('2026-10-01', 600), e4 = entry('2026-09-30', 600);
  const f = fixture(t, {
    'log.md': log([e1, e2, e3, e4]),
    'log-archive/2026-09.md': `# AI Brain log — 2026-09\n\n${entry('2026-09-29', 3)}\n`,
  });
  const r = f.run('--limit', '900'); assert.equal(r.status, 0, r.stderr);
  const kept = f.read('log.md');
  assert.ok(Math.ceil(Buffer.byteLength(kept) / 3) <= 900);
  assert.ok(kept.includes(e1));
  assert.ok(!kept.includes(e3) && !kept.includes(e4));
  assert.match(kept, /\[Earlier entries\]\(log-archive\/2026-10\.md\)\.\n$/);
  const oct = f.read('log-archive/2026-10.md');
  assert.ok(oct.startsWith('# AI Brain log — 2026-10\n\n'));
  assert.ok(oct.indexOf(e2) < oct.indexOf(e3), 'newest first');
  const sep = f.read('log-archive/2026-09.md');
  assert.ok(sep.indexOf(e4) > 0 && sep.indexOf(e4) < sep.indexOf(entry('2026-09-29', 3)), 'inserted above older entries');
  const all = kept + oct + sep;
  for (const e of [e1, e2, e3, e4]) assert.equal(all.split(e).length - 1, 1, 'each entry exactly once');
});
test('keeps at least the newest entry and refuses an unrecognized layout', t => {
  const big = entry('2026-10-03', 3000);
  const f = fixture(t, { 'log.md': log([big, entry('2026-10-01', 5)]) });
  assert.equal(f.run('--limit', '10').status, 0);
  assert.ok(f.read('log.md').includes(big));
  const g = fixture(t, { 'log.md': 'no header\n' });
  const r = g.run(); assert.equal(r.status, 2);
  assert.equal(g.read('log.md'), 'no header\n');
});
test('a paragraph without a date moves with the entry above it, unchanged', t => {
  const e1 = entry('2026-10-03', 600), e2 = `${entry('2026-10-02', 600)}\n\nПродолжение записи без даты.`, e3 = entry('2026-10-01', 600);
  const f = fixture(t, { 'log.md': log([e1, e2, e3]) });
  const r = f.run('--limit', '400'); assert.equal(r.status, 0, r.stderr);
  assert.ok(!f.read('log.md').includes('Продолжение записи'));
  assert.ok(f.read('log-archive/2026-10.md').includes(e2));
});
