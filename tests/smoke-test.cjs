const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function cssClasses(){
 const entries=new Set();return {add:(...x)=>x.forEach(v=>entries.add(v)),remove:(...x)=>x.forEach(v=>entries.delete(v)),contains:(x)=>entries.has(x),toggle:(x,force)=>{const on=force===undefined?!entries.has(x):force;if(on)entries.add(x);else entries.delete(x);return on;}};
}
class MockElement{
 constructor(id=''){this.id=id;this.style={};this.classList=cssClasses();this.events={};this.dataset={};this.textContent='';this.innerHTML='';this.value='';this.children=[];this.hidden=false;this.disabled=false;this.scrollHeight=20;this.scrollTop=0;this.width=360;this.height=64;}
 addEventListener(type,cb){(this.events[type]??=[]).push(cb);}
 dispatch(type,target=this){(this.events[type]||[]).forEach(cb=>cb({target,currentTarget:this,key:'',preventDefault(){}}));}
 appendChild(item){this.children.push(item);}
 setAttribute(key,val){this[key]=val;}
 getAttribute(key){return this[key]||'';}
 querySelectorAll(){return [];}
 querySelector(){return null;}
 closest(){return null;}
 scrollIntoView(){}
 getContext(){const ctx={beginPath(){},clearRect(){},moveTo(){},lineTo(){},stroke(){},fill(){},createLinearGradient(){return {addColorStop(){}}}};return ctx;}
}
const dom=new Map();
const get=id=>{if(!dom.has(id))dom.set(id,new MockElement(id));return dom.get(id);};
const document={body:new MockElement('body'),getElementById:get,querySelector(){return get('app')},querySelectorAll(){return []},createElement(tag){return new MockElement(tag)},addEventListener(){}};
const store=new Map();const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const context={console,window:null,document,localStorage,sessionStorage:localStorage,location:{protocol:'file:',href:'file:///preview.html'},history:{length:1},navigator:{mediaDevices:{getUserMedia:()=>Promise.reject(new Error('not used'))}},setTimeout:(f)=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},Date,Math,Promise,Uint8Array,requestAnimationFrame:()=>1,cancelAnimationFrame(){},URL:{createObjectURL(){return 'blob:fake'},revokeObjectURL(){}},Blob,fetch(){return Promise.reject(new Error('offline'))},indexedDB:null};
context.window=context;
context.matchMedia=()=>({matches:false});
context.addEventListener=()=>{};
context.SpeechToText={hasRecording:true,hasTTS:true,hasLiveInterim:true,speak(){},stopSpeaking(){}};
context.AIExaminer={activeBackend(){return 'offline'},SUGGESTED_PROMPTS:['Hello'],formatMarkdown:s=>s,gradeLocal(){return ''},gradeLocalFull(){return ''},replyLocal(){return ''},isOnline(){return false}};
const sandbox=vm.createContext(context);
function load(p){return vm.runInContext(fs.readFileSync(path.join(root,p),'utf8'),sandbox,{filename:p,timeout:3000});}
load('assets/js/data/topics.js');
load('assets/js/data/translations.js');load('assets/js/data/question-hints.js');load('assets/js/data/question-ideas.js');
assert.equal(context.BandRoomData.TOPICS.length,30,'must have 30 topic collections');
for(const topic of context.BandRoomData.TOPICS){
 assert.ok(topic.name);assert.equal(topic.part1.length,4);assert.equal(topic.part3.length,4);
 assert.ok(topic.part2.title);assert.equal(topic.part2.bullets.length,4);
}
assert.equal(new Set(context.BandRoomData.TOPICS.map(t=>t.name)).size,30,'unique topic names');

load('assets/js/features/examiner/gemini-client.js');
load('assets/js/features/examiner/ai-examiner-chatbot.js');
assert.equal(context.AIExaminer.isOnline(), false, 'no API key => offline');
assert.equal(context.AIExaminer.activeBackend(), 'offline', 'offline examiner can start');
load('assets/js/features/questions/question-assist.js');
const support=context.BandRoomQuestionAssist.forQuestion(context.BandRoomData.TOPICS[8].part1[0],context.BandRoomData.TOPICS[8],1);
assert.ok(support.ideas.length>=2&&support.hints.length>=2);
load('assets/js/features/history/audio-library.js');
load('assets/js/app/navigation.js');

const helperButtons=['hint','ideas','translate'].map(view=>{
 const button=new MockElement();button.dataset.view=view;
 button.closest=selector=>selector==='.helper-tab'?button:null;
 return button;
});
get('helperTabs').querySelectorAll=()=>helperButtons;
load('assets/js/app/main.js');
assert.equal(get('topicSelect').children.length,30,'topic select is populated');
assert.ok(get('qText').textContent.length>4,'question displayed');
get('sidebarToggle').dispatch('click');
assert.ok(document.body.classList.contains('sidebar-collapsed'),'desktop sidebar toggles');
get('topicSelect').value='10';get('topicSelect').dispatch('change');
assert.equal(get('topicPill').textContent,context.BandRoomData.TOPICS[10].name,'manual topic selection');
assert.equal(get('qText').textContent,context.BandRoomData.TOPICS[10].part1[0]);
get('shuffleTopicBtn').dispatch('click');
assert.ok(context.BandRoomData.TOPICS.some(t=>t.name===get('topicPill').textContent));

function selectHelper(view){
 const button=helperButtons.find(b=>b.dataset.view===view);
 get('helperTabs').dispatch('click',button);
 for(const candidate of helperButtons){
  assert.equal(candidate.getAttribute('aria-pressed'),String(candidate===button));
  assert.equal(candidate.classList.contains('active'),candidate===button);
 }
 return get('helperContent').innerHTML;
}
let selected=context.BandRoomData.TOPICS[Number(get('topicSelect').value)];
assert.match(selectHelper('hint'),/Cách triển khai câu trả lời/);
assert.match(selectHelper('ideas'),/Một vài hướng để kể/);
assert.ok(selectHelper('translate').includes(context.BandRoomData.TRANSLATIONS[selected.part1[0]]));
get('partNav').dispatch('click',{closest:()=>({dataset:{part:'2'}})});
const cueHtml=selectHelper('translate');
assert.ok(cueHtml.includes(context.BandRoomData.TRANSLATIONS[selected.part2.title]));
assert.equal((cueHtml.match(/<li>/g)||[]).length,4,'all cue bullets visible in translation');
for(const bullet of selected.part2.bullets)assert.ok(cueHtml.includes(context.BandRoomData.TRANSLATIONS[bullet]));
get('partNav').dispatch('click',{closest:()=>({dataset:{part:'3'}})});
assert.equal((selectHelper('translate').match(/<li>/g)||[]).length,0,'no old cue bullets in Part 3');
console.log('PASS: startup, 30 topics, navigation, helper tabs and pressed states; complete Part 2 translation; no stale cue bullets');

