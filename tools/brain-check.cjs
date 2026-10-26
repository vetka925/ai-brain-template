#!/usr/bin/env node
// Mechanical checks only. Estimates are ceil(UTF-8 bytes / 3), not model token counts.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const budgets = {'CLAUDE.md':1900,'wiki/meta/conventions.md':2700,'wiki/meta/profile.md':700,'tasks.md':2800,'index.md':1500,'log.md':2500,'wiki/meta/reflections.md':10000};
const estimate = text => Math.ceil(Buffer.byteLength(text, 'utf8') / 3);
const git = (...args) => execFileSync('git', args, {encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024});
const names = text => text.split('\0').filter(Boolean);
const mechanism = file => /(^|\/)(CLAUDE|AGENTS|GEMINI|SKILL)\.md$/.test(file) || /^(tasks|index|log)\.md$/.test(file) || /^\.claude\/skills\/[^/]+\/templates\/.*\.md$/.test(file) || /^wiki\/_templates\//.test(file) || /^wiki\/meta\/(profile|conventions|reflections)\.md$/.test(file) || /^wiki\/[^/]+\/_context\.md$/.test(file);
function extractLinks(text) {
 const links=[];
 const lineAt=index=>text.slice(0,index).split('\n').length;
 const mask=fragment=>fragment.replace(/[^\n]/g,' ');
 // Frontmatter can contain Obsidian source links; code examples are not navigable links.
  const navigable=text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm,mask).replace(/`+[^`\n]*`+/g,mask);
  for(const m of navigable.matchAll(/\[\[([^\]\n]+)\]\]/g)) links.push({target:m[1],obsidian:true,line:lineAt(m.index)});
  for(const match of navigable.matchAll(/\[[^\]\n]*\]\(\s*/g)) {
   let i=match.index+match[0].length, target='', depth=0;
   const angle=navigable[i]==='<';
   if(navigable[i]==='<') {
    const end=navigable.indexOf('>',i+1);
    if(end<0) continue;
    target=navigable.slice(i+1,end);
   } else {
    for(;i<navigable.length;i++) {
     const char=navigable[i];
     if(char==='\\' && i+1<navigable.length) {target+=navigable[++i];continue;}
     if(char==='(') depth++;
     if(char===')') {if(depth===0)break;depth--;}
     if(/\s/.test(char) && depth===0)break;
     target+=char;
    }
   }
   if(target)links.push({target,obsidian:false,line:lineAt(match.index),angle});
  }
  for(const m of navigable.matchAll(/^ {0,3}\[[^\]\n]+\]:\s*(?:<([^>]+)>|([^\s]+))/gm)) links.push({target:m[1]||m[2],obsidian:false,line:lineAt(m.index)});
 return links;
}
const startup=['CLAUDE.md','wiki/meta/conventions.md','wiki/meta/profile.md'];
// Pre-commit gate: blocks only staged startup files over budget; needs no YAML package.
function stagedStartup() {
 process.chdir(git('rev-parse','--show-toplevel').trim());
 const staged=new Set(names(git('diff','--cached','--name-only','-z')));
 if(!startup.some(f=>staged.has(f))) return 0;
 const size=f=>{try{return estimate(git('show',`:${f}`));}catch{return 0;}};
 const errors=[];
 for(const f of startup) if(staged.has(f) && size(f)>budgets[f]) errors.push(`${f}: ${size(f)} > ${budgets[f]}`);
 const total=startup.reduce((sum,f)=>sum+size(f),0);
 if(total>6000) errors.push(`startup: ${total} > 6000`);
 for(const e of errors) console.log(`Startup budget exceeded, commit blocked: ${e}`);
 return errors.length?1:0;
}
const normalizeTarget = target => target.trim().replace(/\\\|/g,'|').split('|')[0].split('#')[0].trim();
function main() {
 const args=process.argv.slice(2); let base=null, all=false, json=false;
 for(let i=0;i<args.length;i++) {
  if(args[i]==='--all') all=true;
  else if(args[i]==='--json') json=true;
  else if(args[i]==='--base' && args[i+1] && !args[i+1].startsWith('-')) base=args[++i];
  else throw new Error('usage');
 }
 process.chdir(git('rev-parse','--show-toplevel').trim());
 if(base) base=git('rev-parse','--verify',`${base}^{commit}`).trim();
 const tracked=names(git('ls-files','-z'));
 const untracked=names(git('ls-files','--others','--exclude-standard','-z'));
 const changed=new Set(base ? [...names(git('diff','--name-only','-z',base,'--')), ...untracked] : []);
 const removed=base ? names(git('diff','--no-renames','--diff-filter=D','--name-only','-z',base,'--')) : [];
 const files=[...new Set([...tracked,...changed,...(all?untracked:[])])];
 const report={scope:all?'all':'mechanisms',checked:0,errors:[],review:[],preExisting:[],metrics:{},estimateMethod:'ceil(UTF-8 bytes / 3); conservative heuristic, not actual model tokens'};
 const issue=(bucket,file,code,detail,line)=>report[bucket].push({path:file,code,detail,...(line?{line}:{})});
 const exists=file=>{try{return fs.statSync(file).isFile() || fs.statSync(file).isDirectory();}catch{return false;}};
 const markdown=files.filter(f=>f.endsWith('.md'));
 const baseLinks=new Map(), baseExistence=new Map();
 function existed(candidate) {
  const relative=path.relative(process.cwd(),candidate);
  if(relative.startsWith('../') || path.isAbsolute(relative)) return true; // Git cannot establish external-path history.
  if(!baseExistence.has(relative)) {
   try {git('cat-file','-e',base+':'+relative);baseExistence.set(relative,true);}
   catch {baseExistence.set(relative,false);}
  }
  return baseExistence.get(relative);
 }
 function preExisting(file,target,obsidian,candidates) {
  if(!base) return false;
  if(!baseLinks.has(file)) {
   try {baseLinks.set(file,extractLinks(git('show',base+':'+file)));}
   catch {baseLinks.set(file,[]);}
  }
  const same=baseLinks.get(file).some(link=>{
   try{return link.obsidian===obsidian && decodeURIComponent(normalizeTarget(link.target))===target;}
   catch{return false;}
  });
  return same && !candidates.some(existed);
 }
 function checkLink(file, target, obsidian, incomingOnly=false, line, angle=false) {
  if(/\/templates\//.test(file) && angle && /^(path|prototype\.html#route)$/.test(target))return;
  target=normalizeTarget(target);
  if(!target || /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//') || /[<>*{}]/.test(target)) return;
  try { target=decodeURIComponent(target); } catch { issue('review',file,'link-format','Malformed URL encoding',line);return; }
  // Monthly log entries are archived unchanged from root log.md.
  const monthlyArchive=/^log-archive\/\d{4}-\d{2}\.md$/.test(file);
  const candidates=[path.resolve(path.dirname(file),target)];
  if(obsidian || monthlyArchive) candidates.push(path.resolve(target));
  if(obsidian) {
   candidates.push(...candidates.map(p=>p+'.md'));
   if(!target.includes('/')) {
    const found=markdown.filter(p=>path.basename(p,'.md')===target.replace(/\.md$/,''));
    if(found.length>1) issue('review',file,'link-ambiguous','Multiple pages match a bare wiki link',line);
    // Bare entities may intentionally denote concepts without a page.
    return;
   }
  }
  if(incomingOnly && !candidates.some(candidate=>{
   const relative=path.relative(process.cwd(),candidate);
   return removed.some(file=>file===relative || file.startsWith(relative+'/'));
  }))return;
  if(!candidates.some(exists)) issue(preExisting(file,target,obsidian,candidates)?'preExisting':'errors',file,'link','Unresolved local file destination',line);
 }
 for(const file of files) {
  let stat;try {stat=fs.lstatSync(file);}catch {continue;}
  if(stat.isSymbolicLink()) { if(!exists(file)) issue('errors',file,'symlink','Broken symlink'); continue; }
  if(!file.endsWith('.md'))continue;
  const incomingOnly=!all && !mechanism(file) && !changed.has(file);
  if(incomingOnly && removed.length===0)continue;
  if(file.startsWith('raw/') && !/(^|\/)CLAUDE\.md$/.test(file)) continue;
  report.checked++;
  const text=fs.readFileSync(file,'utf8');
  if(incomingOnly) {
   for(const link of extractLinks(text))checkLink(file,link.target,link.obsidian,true,link.line,link.angle);
   continue;
  }
  let meta=null;
  if(/^---\r?\n/.test(text)) {
   const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
   if(!match) issue('errors',file,'yaml','Unclosed frontmatter');
   else {
    const doc=require('yaml').parseDocument(match[1],{prettyErrors:false});
    if(doc.errors.length) issue('errors',file,'yaml','Invalid YAML frontmatter');
    else {try{meta=doc.toJS({maxAliasCount:100});}catch{issue('errors',file,'yaml','Invalid YAML aliases');}}
   }
  }
  const template=file.startsWith('wiki/_templates/');
  const knowledge=/^wiki\//.test(file) && !/(^|\/)(CLAUDE|AGENTS|GEMINI)\.md$/.test(file);
  const durable=/^(wiki|design|docs)\//.test(file) && !/(^|\/)(CLAUDE|AGENTS|GEMINI)\.md$/.test(file);
  if(durable && file !== 'wiki/_templates/raw-source.md') {
   const aggregate=['wiki/meta/reflections.md','wiki/meta/reflections-archive.md'].includes(file);
   const required=aggregate ? ['type','last_linted'] : knowledge ? ['type','sources','last_linted','authorship'] : ['authorship'];
   const absent=required.filter(k=>!meta || typeof meta!=='object' || !Object.hasOwn(meta,k));
   if(!template && meta && typeof meta==='object') {
    if(required.includes('type') && (typeof meta.type!=='string'||!meta.type.trim())) absent.push('type');
    // Unmarked knowledge is draft; a present status must be a known value.
    if(knowledge && Object.hasOwn(meta,'status') && !['draft','verified'].includes(meta.status)) absent.push('status');
    for(const k of ['sources','authorship']) if(required.includes(k) && (!Array.isArray(meta[k])||meta[k].length===0)) absent.push(k);
   }
   if(absent.length) issue(changed.has(file)||template?'errors':'review',file,'metadata',`Missing or invalid fields: ${[...new Set(absent)].join(', ')}`);
  }
  for(const link of extractLinks(text)) checkLink(file,link.target,link.obsidian,false,link.line,link.angle);
 }
 for(const [file,limit] of Object.entries(budgets)) if(exists(file)) {
  const text=fs.readFileSync(file,'utf8');
  const metric={bytes:Buffer.byteLength(text,'utf8'),estimate:estimate(text),limit};
  if(base) {try{metric.before=estimate(git('show',`${base}:${file}`));}catch{metric.before=null;}}
  report.metrics[file]=metric;
  if(metric.estimate>limit) issue('errors',file,'budget',`${metric.estimate} > ${limit}`);
 }
 const startupEstimate=startup.reduce((sum,f)=>sum+(report.metrics[f]?.estimate||0),0);
 report.metrics.startup={estimate:startupEstimate,limit:6000};
 if(base) report.metrics.startup.before=startup.reduce((sum,f)=>sum+(report.metrics[f]?.before||0),0);
 if(startupEstimate>6000) issue('errors','startup','budget',`${startupEstimate} > 6000`);
 if(json) console.log(JSON.stringify(report));
 else {
  console.log(`Brain check: ${report.checked} Markdown files; ${report.errors.length} errors; ${report.review.length} review candidates; ${report.preExisting.length} pre-existing link defects.`);
  console.log(report.estimateMethod);
  for(const [file,m] of Object.entries(report.metrics)) console.log(`${file}: ${m.before!=null?m.before+' → ':''}${m.estimate} / ${m.limit}`);
  for(const bucket of ['errors','review','preExisting']) for(const i of report[bucket].slice(0,30)) console.log(`${bucket}: ${i.path}${i.line?':'+i.line:''}: ${i.code}: ${i.detail}`);
  if(report.review.length>30)console.log('More review candidates: use --json.');
 }
 process.exitCode=report.errors.length?1:0;
}
module.exports={budgets,estimate};
if(require.main===module) {
 // A failing gate must not block commits: invocation errors in staged mode pass.
 if(process.argv[2]==='--staged-startup') {try{process.exitCode=stagedStartup();}catch{process.exitCode=0;}}
 else try{main();}catch{console.log(JSON.stringify({errors:[{code:'invocation',detail:'Unable to run: check Git repository, --base commit, and arguments (--all --base <ref> --json).'}]}));process.exitCode=2;}
}
