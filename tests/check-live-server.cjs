
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const pages=['index.html','preview.html','login.html','signup.html','account.html'];
let referenced=0;
for(const page of pages){
 const html=fs.readFileSync(path.join(root,page),'utf8');
 assert.match(html,/<html\s+lang="vi">/,'language missing in '+page);
 for(const match of html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g)){
  const ref=match[1];
  if (/^(https?:|#|data:|mailto:)/.test(ref)) continue;
  const name=ref.split(/[?#]/)[0];
  assert.ok(fs.existsSync(path.join(root,name)),`${page}: missing ${name}`);
  referenced++;
 }
 if(page==='index.html'||page==='preview.html'){
  assert.doesNotMatch(html,/class="app gated"/);
  assert.match(html,/id="startupAlert"/);
  assert.match(html,/assets\/js\/app\/boot-guard.js/);
 }
}
const css=fs.readFileSync(path.join(root,'assets/css/base.css'),'utf8');
assert.doesNotMatch(css,/\.app\.gated\s*\{\s*visibility\s*:\s*hidden/);
assert.match(fs.readFileSync(path.join(root,'assets/js/app/main.js'),'utf8'),/BandRoomReady = true/);
const jsdir=path.join(root,'assets/js');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const jsfiles=walk(jsdir).filter(f=>f.endsWith('.js'));
for(const file of jsfiles)execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
console.log(`PASS: ${pages.length} HTML pages, ${referenced} local assets, ${jsfiles.length} JS files, visible UI fallback`);
