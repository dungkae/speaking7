
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
 remove(){}
 scrollIntoView(){}
 getContext(){const ctx={beginPath(){},clearRect(){},moveTo(){},lineTo(){},stroke(){},fill(){},createLinearGradient(){return {addColorStop(){}}}};return ctx;}
}
const dom=new Map();
const get=id=>{if(!dom.has(id))dom.set(id,new MockElement(id));return dom.get(id);};
const document={body:new MockElement('body'),getElementById:get,querySelector(){return get('app')},querySelectorAll(){return []},createElement(tag){return new MockElement(tag)},addEventListener(){}};
const store=new Map();const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const context={console,window:null,document,localStorage,sessionStorage:localStorage,location:{protocol:'file:',href:'file:///preview.html'},history:{length:1},navigator:{mediaDevices:{getUserMedia:()=>Promise.reject(new Error('not used'))}},setTimeout,clearTimeout,setInterval:()=>1,clearInterval(){},Date,Math,Promise,Uint8Array,requestAnimationFrame:()=>1,cancelAnimationFrame(){},URL:{createObjectURL(){return 'blob:fake'},revokeObjectURL(){}},Blob,fetch(){return Promise.reject(new Error('offline'))},indexedDB:null};
context.window=context;
context.matchMedia=()=>({matches:false});
context.addEventListener=()=>{};
context.SpeechToText={hasRecording:true,hasTTS:true,hasLiveInterim:true,speak(){},stopSpeaking(){}};
context.AIExaminer={activeBackend(){return 'offline'},SUGGESTED_PROMPTS:['Hello'],formatMarkdown:s=>s,gradeLocal(){return ''},gradeLocalFull(){return ''},replyLocal(){return ''},isOnline(){return false}};
const sandbox=vm.createContext(context);
function load(p){return vm.runInContext(fs.readFileSync(path.join(root,p),'utf8'),sandbox,{filename:p,timeout:3000});}

(async()=>{
 let clock=100000, startResolve, stopResolve, storeResolve;
 class ClockDate extends Date {static now(){return clock;}}
 context.Date=ClockDate;
 context.SpeechToText.start=()=>new Promise(resolve=>{startResolve=resolve;});
 context.SpeechToText.stop=()=>new Promise(resolve=>{stopResolve=resolve;});
 context.SpeechToText.takeLastAudioBlob=()=>new Blob(['audio'],{type:'audio/webm'});
 context.BandRoomAudio={store:()=>new Promise(resolve=>{storeResolve=resolve;}),load:()=>Promise.resolve(null),hydrate(){}};
 context.BandRoomExaminerReady=Promise.resolve();
 load('assets/js/data/topics.js');
load('assets/js/data/translations.js');load('assets/js/data/question-hints.js');load('assets/js/data/question-ideas.js');load('assets/js/features/questions/question-assist.js');load('assets/js/app/navigation.js');
 let source=fs.readFileSync(path.join(root,'assets/js/app/main.js'),'utf8');
 source=source.replace('window.BandRoomReady = true;', 'window.__test={state:state,extractOverall:extractOverall,escapeHtml:escapeHtml,submitGrading:submitGrading}; window.BandRoomReady = true;');
 vm.runInContext(source,sandbox);
 const state=context.__test.state, original=state.topic;
 const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
 get('micBtn').dispatch('click');
 assert.equal(state.starting,true,'locks pending microphone permission');
 get('topicSelect').value='10';get('topicSelect').dispatch('change');
 assert.equal(state.topic,original,'topic frozen while requesting mic');
 clock+=5000;startResolve(true);await flush();
 assert.equal(state.recStart,clock,'clock starts only after permission');
 clock+=45000;get('micBtn').dispatch('click');
 clock+=7000;stopResolve({text:'This is my answer.',source:'browser'});await flush();
 assert.equal(state.answersByPart[1][0].seconds,45,'recognition delay excluded from duration');
 assert.equal(state.processing,true,'locks until audio persistence finishes');
 get('newSessionBtn').dispatch('click');assert.equal(state.topic,original);
 storeResolve('audio-id');await flush();assert.equal(state.processing,false);
 assert.equal(state.answersByPart[1][0].audioId,'audio-id');
 assert.equal(context.__test.extractOverall('Overall: 5.0\nOverall Speaking: 7.0'),7);
 assert.equal(context.__test.extractOverall('Overall: 4.0\nOverall: 6.5'),6.5);
 assert.equal(context.__test.extractOverall('Overall: chưa đánh giá'),null);
 assert.equal(context.__test.escapeHtml('" onclick="alert(1)'), '&quot; onclick=&quot;alert(1)');
 let gradeResolve, captured;
 context.AIExaminer.gradeAnswers=(answers,mode,part)=>{captured={answers,mode,part};return new Promise(resolve=>{gradeResolve=resolve;});};
 context.__test.submitGrading('part');await flush();
 assert.equal(state.gradingBusy,true);get('redoBtn').dispatch('click');assert.equal(state.answersByPart[1].length,1);
 get('shuffleTopicBtn').dispatch('click');assert.equal(state.topic,original);
 gradeResolve('Overall Speaking: 7.0');await flush();
 assert.equal(state.gradingBusy,false);
 const saved=JSON.parse(localStorage.getItem('band_room_practice_v3_guest'));
 assert.equal(saved[0].topic,original.name);assert.equal(saved[0].answers[1][0].audioId,'audio-id');
 get('newSessionBtn').dispatch('click');assert.equal(get('sendToBotBtn').disabled,true);assert.equal(state.answersByPart[1].length,0);
 console.log('PASS: pending mic locks, immutable session identity, accurate recording duration, audio persistence lock, grading lock and snapshot, safe attributes, final overall, session reset');
})().catch(err=>{console.error(err);process.exitCode=1;});
