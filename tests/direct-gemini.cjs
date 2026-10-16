const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const calls=[];let fail=0;
const review={transcript:'I enjoy books.',criteria:{fluency_coherence:6,lexical_resource:6,grammatical_range_accuracy:6,pronunciation:7},corrected_answer:'I enjoy books.',natural_answer:'I enjoy reading books.',summary_vi:'Nhận xét',feedback_vi:[],pronunciation_notes_vi:[],word_feedback:[]};
const context={console,setTimeout,clearTimeout,AbortSignal,AbortController,Promise,Uint8Array,btoa:s=>Buffer.from(s,'binary').toString('base64'),env:{GEMINI_KEY:'test-key',GEMINI_MODELS:['gemini-test','gemini-next']},fetch:async(url,options)=>{
 calls.push({url,options});if(fail){const status=fail;fail=0;return {ok:false,status,json:async()=>({error:{message:"provider error"}})}};
 const req=JSON.parse(options.body);return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:req.generationConfig.responseSchema?JSON.stringify(review):'Hello'}]}}]})};
}};context.window=context;vm.createContext(context);
for(const name of ['gemini-client.js','ai-examiner-chatbot.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/features/examiner',name),'utf8'),context);
(async()=>{
await context.BandRoomExaminerReady;assert.equal(context.AIExaminer.isOnline(),true);
let r=await context.AIExaminer.reviewAnswer(1,'What do you enjoy?','I enjoy books.');assert.equal(r.overall,null);assert.equal(r.criteria.pronunciation,null);
const blob={size:3,type:'audio/webm;codecs=opus',arrayBuffer:async()=>new Uint8Array([1,2,3]).buffer};r=await context.AIExaminer.reviewAnswer(1,'Q','',blob);assert.equal(r.used_audio,true);assert.equal(r.overall,6.5);assert.equal(JSON.parse(calls.at(-1).options.body).contents[0].parts[1].inlineData.mimeType,'audio/webm');
fail=503;assert.equal(await context.AIExaminer.chat([{role:'user',content:'Hello'}]),'Hello');
fail=403;await assert.rejects(context.AIExaminer.chat([{role:'user',content:'Hello'}]),/HTTP 403/);
assert(calls.every(c=>c.url.startsWith('https://generativelanguage.googleapis.com/v1beta/models/')));assert(calls.every(c=>c.url.endsWith('?key=test-key')));
console.log('PASS: direct Gemini, text/audio, no fabricated pronunciation, fallback503, explicit403; no local API calls');
})().catch(e=>{console.error(e);process.exitCode=1});
