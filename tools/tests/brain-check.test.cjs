const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const cli = path.resolve(__dirname, '../brain-check.cjs');
function fixture(t, files) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'brain-check-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  const write = (name, content) => { fs.mkdirSync(path.dirname(path.join(cwd, name)), { recursive: true }); fs.writeFileSync(path.join(cwd, name), content); };
  git('init', '-q'); git('config', 'user.email', 'fixture@example.invalid'); git('config', 'user.name', 'Fixture');
  for (const [name, content] of Object.entries(files)) write(name, content);
  git('add', '.'); git('commit', '-qm', 'Fixture');
  return { cwd, git, write, run: (...args) => { const r = spawnSync(process.execPath, [cli, '--json', ...args], { cwd, encoding: 'utf8' }); assert.equal(r.signal, null); assert.ok(r.stdout, r.stderr); return { status: r.status, ...JSON.parse(r.stdout) }; } };
}
const knowledge = '---\ntype: concept\nstatus: draft\nsources: ["Owner, 2026-09-05"]\nlast_linted: ""\nauthorship: [{kind: model, model: gpt-6-astra, contribution: created}]\n---\n';
test('default ignores unrelated wiki content but all catches malformed YAML without leaking values', t => {
 const f = fixture(t, {'CLAUDE.md':'# Rules', 'wiki/private.md':'---\nsecret: [PRIVATE_VALUE\n---\n'});
 assert.equal(f.run().status,0);
 const r=f.run('--all'); assert.equal(r.status,1); assert.ok(r.errors.some(e=>e.code==='yaml')); assert.ok(!JSON.stringify(r).includes('PRIVATE_VALUE'));
});
test('new untracked knowledge is checked with base; legacy metadata remains review-only', t => {
 const f=fixture(t, {'CLAUDE.md':'# Rules','wiki/old.md':'# Old'});
 f.write('wiki/new.md','# New');
 const r=f.run('--base','HEAD'); assert.equal(r.status,1); assert.ok(r.errors.some(e=>e.path==='wiki/new.md' && e.code==='metadata'));
 const all=f.run('--all'); assert.ok(all.review.some(e=>e.path==='wiki/old.md'));
});
test('operational records need no status; knowledge metadata accepts pending lint date',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules'});
 f.write('wiki/new.md',knowledge+'# New'); f.write('wiki/ops.md',knowledge.replace('type: concept\nstatus: draft','type: operational')+'# Ops');
 assert.equal(f.run('--base','HEAD').status,0);
});
test('resolves aliases, escaped pipes, anchor paths and ignores unknown bare entities and code examples',t=>{
 const f=fixture(t,{'CLAUDE.md':'[page](wiki/a.md#heading) [[wiki/a\\|Alias]] [[Person]]\n`[[missing/path]]`\n```md\n[example](missing.md)\n```','wiki/a.md':knowledge+'# Heading\n'});
 assert.equal(f.run().status,0);
 f.write('CLAUDE.md','[missing](wiki/missing.md) [[wiki/absent|Alias]]');
 const r=f.run();assert.equal(r.status,1);assert.equal(r.errors.filter(e=>e.code==='link').length,2);
});
test('broken tracked symlinks fail and raw contents are never parsed or modified',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules','raw/source.md':'---\nbad: [\n---'});
 fs.symlinkSync('missing',path.join(f.cwd,'AGENTS.md'));f.git('add','AGENTS.md');
 const r=f.run('--all');assert.equal(r.status,1);assert.deepEqual(r.errors.map(e=>e.code),['symlink']);assert.equal(fs.readFileSync(path.join(f.cwd,'raw/source.md'),'utf8'),'---\nbad: [\n---');
});
test('byte budgets fail and base reports real before and after estimates',t=>{
 const f=fixture(t,{'CLAUDE.md':'abc'});f.write('CLAUDE.md','я'.repeat(3000));
 const r=f.run('--base','HEAD');assert.equal(r.status,1);assert.equal(r.metrics['CLAUDE.md'].before,1);assert.equal(r.metrics['CLAUDE.md'].estimate,2000);assert.ok(r.errors.some(e=>e.code==='budget'));
});
test('invalid base fails explicitly rather than silently reducing scope',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules'});assert.equal(f.run('--base','not-a-ref').status,2);
});
test('raw-source template is not subject to knowledge-page metadata',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules','wiki/_templates/raw-source.md':'---\ntitle: ""\ndate: ""\n---\n# Raw source'});
 assert.equal(f.run().status,0);
});
test('staged new knowledge and changed legacy knowledge receive strict metadata checks',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules','wiki/legacy.md':'# Legacy'});
 f.write('wiki/new.md','# New');f.git('add','wiki/new.md');f.write('wiki/legacy.md','# Changed');
 const r=f.run('--base','HEAD');assert.equal(r.status,1);assert.deepEqual(r.errors.filter(e=>e.code==='metadata').map(e=>e.path).sort(),['wiki/legacy.md','wiki/new.md']);
});
test('checks image and reference-style destinations as well as ordinary links',t=>{
 const f=fixture(t,{'CLAUDE.md':'![diagram](missing.png)\n[notes][ref]\n\n[ref]: wiki/missing.md\n'});
 const r=f.run();assert.equal(r.status,1);assert.equal(r.errors.filter(e=>e.code==='link').length,2);
});
test('monthly log archives preserve repo-root links but task snapshots resolve normally',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules','log-archive/2026-09.md':'[entry](wiki/page.md)','log-archive/tasks-2026-09-05.md':'[entry](../wiki/page.md)','wiki/page.md':knowledge+'# Page'});
 assert.equal(f.run('--all').status,0);
 f.write('log-archive/tasks-2026-09-05.md','[entry](wiki/page.md)');
 const r=f.run('--all');assert.equal(r.status,1);assert.ok(r.errors.some(e=>e.path==='log-archive/tasks-2026-09-05.md'&&e.code==='link'));
});
test('base includes untracked docs and requires authorship without knowledge-only fields',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules'});f.write('docs/review.md','# Review');
 const bad=f.run('--base','HEAD');assert.equal(bad.status,1);assert.ok(bad.errors.some(e=>e.path==='docs/review.md'&&e.code==='metadata'));
 f.write('docs/review.md','---\nauthorship: [{kind: model, model: gpt-6-astra, contribution: created}]\n---\n# Review');
 assert.equal(f.run('--base','HEAD').status,0);
});
test('base reports pre-existing broken destinations while introduced defects still fail',t=>{
 const f=fixture(t,{'CLAUDE.md':'[old](missing.md)'});f.write('CLAUDE.md','# Changed\n[old](missing.md)');
 const old=f.run('--base','HEAD');assert.equal(old.status,0);assert.ok(old.preExisting.some(e=>e.path==='CLAUDE.md'&&e.code==='link'));
 assert.equal(f.run('--all').status,1);
 f.write('CLAUDE.md','[old](missing.md) [new](introduced.md)');const fresh=f.run('--base','HEAD');assert.equal(fresh.status,1);assert.equal(fresh.errors.filter(e=>e.code==='link').length,1);assert.equal(fresh.preExisting.length,1);
});
test('deleting a previously valid target is introduced even when link text is unchanged',t=>{
 const f=fixture(t,{'CLAUDE.md':'[target](target.md)','target.md':'# Target'});fs.unlinkSync(path.join(f.cwd,'target.md'));
 const r=f.run('--base','HEAD');assert.equal(r.status,1);assert.equal(r.errors.filter(e=>e.code==='link').length,1);assert.equal(r.preExisting.length,0);
});
test('all includes nonignored untracked markdown while raw bodies remain excluded',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules'});f.write('wiki/new.md','---\nbroken: [\n---');f.write('raw/new.md','---\nbroken: [\n---');
 const r=f.run('--all');assert.equal(r.status,1);assert.ok(r.errors.some(e=>e.path==='wiki/new.md'&&e.code==='yaml'));assert.ok(!r.errors.some(e=>e.path==='raw/new.md'));
});
test('Markdown balanced and escaped parentheses resolve the actual destination',t=>{
 const f=fixture(t,{'CLAUDE.md':'[one](target(part).md) [two](target\\(part\\).md)','target(part).md':'# Target'});
 assert.equal(f.run().status,0);fs.unlinkSync(path.join(f.cwd,'target(part).md'));
 assert.equal(f.run().errors.filter(e=>e.code==='link').length,2);
});
test('base finds broken incoming links from untouched knowledge when a destination is renamed',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules','wiki/untouched.md':knowledge+'[target](target.md)','wiki/target.md':knowledge+'# Target'});
 f.git('mv','wiki/target.md','wiki/renamed.md');
 const r=f.run('--base','HEAD');assert.equal(r.status,1);assert.ok(r.errors.some(e=>e.path==='wiki/untouched.md'&&e.code==='link'));
});
test('known reflection aggregates use per-entry evidence and authorship without weakening ordinary wiki',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules'});const aggregate='---\ntype: operational\nlast_linted: ""\n---\n# Entries';
 f.write('wiki/meta/reflections.md',aggregate);f.write('wiki/meta/reflections-archive.md',aggregate);
 assert.equal(f.run('--base','HEAD').status,0);
 f.write('wiki/meta/ordinary.md',aggregate);const r=f.run('--base','HEAD');assert.equal(r.status,1);assert.ok(r.errors.some(e=>e.path==='wiki/meta/ordinary.md'&&e.code==='metadata'));
});
test('link findings report original source lines without exposing destination values',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules\n```md\n[example](ignored.md)\n```\n[one](PRIVATE_PATH.md)\n[[wiki/missing]]\n'});
 const r=f.run();assert.deepEqual(r.errors.filter(e=>e.code==='link').map(e=>e.line),[6,5]);assert.ok(!JSON.stringify(r).includes('PRIVATE_PATH'));
});
test('startup includes bounded profile instead of hiding its context cost',t=>{
 const f=fixture(t,{'CLAUDE.md':'abc','wiki/meta/conventions.md':'abc','wiki/meta/profile.md':'abcdef'});
 const r=f.run(); assert.equal(r.metrics.startup.estimate,4);
 assert.equal(r.metrics['wiki/meta/profile.md'].limit,700);
 f.write('wiki/meta/profile.md','x'.repeat(2103));
 assert.ok(f.run().errors.some(e=>e.path==='wiki/meta/profile.md' && e.code==='budget'));
});
test('knowledge pages need no status; only a present invalid status fails',t=>{
 const f=fixture(t,{'CLAUDE.md':'# Rules'});
 f.write('wiki/new.md',knowledge.replace('status: draft\n','')+'# New');
 assert.equal(f.run('--base','HEAD').status,0);
 f.write('wiki/new.md',knowledge.replace('status: draft','status: approved')+'# New');
 const r=f.run('--base','HEAD');assert.equal(r.status,1);assert.ok(r.errors.some(e=>e.path==='wiki/new.md'&&e.code==='metadata'));
});
test('CLAUDE.md budget is 1900 within the 6000 startup total',t=>{
 const f=fixture(t,{'CLAUDE.md':'x'.repeat(1900*3)});
 const r=f.run();assert.equal(r.metrics['CLAUDE.md'].limit,1900);assert.equal(r.status,0);
});
test('staged-startup blocks only staged startup files over budget and needs no YAML package',t=>{
 const f=fixture(t,{'CLAUDE.md':'x'.repeat(2000*3),'log.md':'# Log'});
 const staged=()=>spawnSync(process.execPath,[cli,'--staged-startup'],{cwd:f.cwd,encoding:'utf8',env:{...process.env,NODE_PATH:''}});
 assert.equal(staged().status,0,'committed overrun without a staged change passes');
 f.write('log.md','x'.repeat(9000));f.git('add','log.md');
 assert.equal(staged().status,0,'non-startup overrun passes');
 f.write('CLAUDE.md','x'.repeat(1950*3));f.git('add','CLAUDE.md');
 const r=staged();assert.equal(r.status,1);assert.match(r.stdout+r.stderr,/CLAUDE\.md.*1950 > 1900/);
 f.write('CLAUDE.md','# Short');f.git('add','CLAUDE.md');
 assert.equal(staged().status,0);
});
