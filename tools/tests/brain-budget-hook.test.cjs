const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const hook = path.resolve(__dirname, '../brain-budget-hook.cjs');
const checker = path.resolve(__dirname, '../brain-check.cjs');
function fixture(t, files = {}) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'brain budget-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const write = (name, text) => {
    fs.mkdirSync(path.dirname(path.join(cwd, name)), { recursive: true });
    fs.writeFileSync(path.join(cwd, name), text);
  };
  write('tools/brain-check.cjs', fs.readFileSync(checker));
  fs.symlinkSync(path.resolve(__dirname, '../../node_modules'), path.join(cwd, 'node_modules'), 'dir');
  write('CLAUDE.md', '# Rules');
  for (const [name, text] of Object.entries(files)) write(name, text);
  execFileSync('git', ['init', '-q', cwd]);
  execFileSync('git', ['add', '.'], { cwd });
  const run = (args = ['--start'], dir = cwd) => {
    const r = spawnSync(process.execPath, [hook, ...args], {
      cwd: dir, encoding: 'utf8', input: '{}', timeout: 14000,
      env: { ...process.env, CLAUDE_PROJECT_DIR: cwd },
    });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stderr, '');
    return r.stdout;
  };
  return { cwd, write, run };
}
const daysAgo = days => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
test('below 85 percent is silent', t => {
  assert.equal(fixture(t, { 'log.md': 'x'.repeat(2124 * 3) }).run(), '');
});
test('85 percent warns using checker metrics', t => {
  assert.match(fixture(t, { 'log.md': 'x'.repeat(2125 * 3) }).run(), /log\.md at 85%.*2125\/2500.*npm run rotate:log/);
});
test('overrun reports even though checker exits 1; never blocks', t => {
  const f = fixture(t, { 'log.md': 'x'.repeat(2501 * 3) });
  assert.match(f.run(), /log\.md.*2501\/2500.*over by 1/);
  assert.equal(f.run(['--stop']), '');
});
test('aggregate startup budget is reported', t => {
  const f = fixture(t, {
    'CLAUDE.md': 'x'.repeat(1800 * 3),
    'wiki/meta/conventions.md': 'x'.repeat(2700 * 3),
    'wiki/meta/profile.md': 'x'.repeat(700 * 3),
  });
  assert.match(f.run(), /startup.*5200\/6000/);
});
test('review is overdue after 30 days, not at 30', t => {
  const f = fixture(t);
  f.write('wiki/meta/reflections.md', `---\nreviewed: ${daysAgo(30)}\n---\n`);
  assert.equal(f.run(), '');
  f.write('wiki/meta/reflections.md', `---\nreviewed: ${daysAgo(31)}\n---\n`);
  assert.match(f.run(), /reflections review overdue: last .*31 days ago/);
});
test('invalid dates are ignored', t => {
  const f = fixture(t, { 'wiki/meta/reflections.md': '---\nreviewed: 2020-02-31\n---\n' });
  assert.equal(f.run(), '');
});
test('checker failure or invalid JSON is silent', t => {
  const f = fixture(t);
  for (const code of ['process.exit(2)', 'console.log("bad json")', 'console.log("{}")']) {
    f.write('tools/brain-check.cjs', code);
    assert.equal(f.run(), '');
  }
});
test('missing repository is silent', t => {
  const f = fixture(t);
  fs.rmSync(path.join(f.cwd, '.git'), { recursive: true });
  assert.equal(f.run(), '');
});
test('project path works from a subdirectory', t => {
  const f = fixture(t, { 'log.md': 'x'.repeat(2125 * 3) });
  assert.match(f.run(['--start'], path.join(f.cwd, 'tools')), /log\.md at 85%/);
});
test('both configured startup commands work from paths with spaces and subdirectories', t => {
  const f = fixture(t, { 'log.md': 'x'.repeat(2125 * 3) });
  f.write('tools/brain-budget-hook.cjs', fs.readFileSync(hook));
  for (const config of ['.claude/settings.json', '.codex/hooks.json']) {
    const settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../..', config)));
    const env = { ...process.env };
    delete env.CLAUDE_PROJECT_DIR;
    if (config.startsWith('.claude/')) env.CLAUDE_PROJECT_DIR = f.cwd;
    const command = settings.hooks.SessionStart[0].hooks[0].command;
    const r = spawnSync('/bin/sh', ['-c', command], {
      cwd: path.join(f.cwd, 'tools'), env, encoding: 'utf8', timeout: 14000,
    });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stderr, '');
    assert.match(r.stdout, /log\.md at 85%/);
  }
});
