const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const calls=[];let fail=0, rejectAudio=false;
const review={transcript:'I enjoy books.',criteria:{fluency_coherence:6,lexical_resource:6,grammatical_range_accuracy:6,pronunciation:7},corrected_answer:'I enjoy books.',natural_answer:'I enjoy reading books.',summary_vi:'Nhận xét',feedback_vi:[],pronunciation_notes_vi:[],word_feedback:[]};
const context={console,setTimeout,clearTimeout,AbortSignal,AbortController,Promise,Uint8Array,DataView,DOMException,btoa:s=>Buffer.from(s,'binary').toString('base64'),env:{GEMINI_KEY:'test-key',GEMINI_MODELS:['gemini-test','gemini-next']},fetch:async(url,options)=>{
 calls.push({url,options});if(fail){const status=fail;fail=0;return {ok:false,status,json:async()=>({error:{message:"provider error"}})}};
 const req=JSON.parse(options.body);
 if(rejectAudio && req.contents[0].parts.some(part=>part.inlineData))return {ok:false,status:400,json:async()=>({error:{}})};
 return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:req.generationConfig.responseSchema?JSON.stringify(review):'Hello'}]}}]})};
}};context.window=context;vm.createContext(context);
for(const name of ['gemini-client.js','gemini-settings.js','ai-examiner-chatbot.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/features/examiner',name),'utf8'),context);
(async()=>{
await context.BandRoomExaminerReady;assert.equal(context.AIExaminer.isOnline(),false);
await context.BandRoomGeminiSettings.connect({apiKey:'test-key',model:'gemini-test'});assert.equal(context.AIExaminer.isOnline(),true);
let r=await context.AIExaminer.reviewAnswer(1,'What do you enjoy?','I enjoy books.');assert.equal(r.overall,null);assert.equal(r.criteria.pronunciation,null);
const blob={size:3,type:'audio/webm;codecs=opus',arrayBuffer:async()=>new Uint8Array([1,2,3]).buffer};r=await context.AIExaminer.reviewAnswer(1,'Q','',blob);assert.equal(r.used_audio,true);assert.equal(r.overall,6.5);assert.equal(JSON.parse(calls.at(-1).options.body).contents[0].parts[1].inlineData.mimeType,'audio/webm');
rejectAudio=true;
await context.BandRoomGeminiSettings.connect({apiKey:'test-key',model:'gemini-text-only'});
r=await context.AIExaminer.reviewAnswer(1,'Q','I enjoy books.',blob);
assert.equal(r.used_audio,false);assert.equal(r.criteria.pronunciation,null);
assert.equal(JSON.parse(calls.at(-1).options.body).contents[0].parts.length,1);
const beforeAudioOnly=calls.length;
await assert.rejects(context.AIExaminer.reviewAnswer(1,'Q','',blob),/transcript|bản chép/i);
assert.equal(calls.length,beforeAudioOnly);
fail=503;await assert.rejects(context.AIExaminer.chat([{role:'user',content:'Hello'}]),/Dịch vụ Gemini/);
fail=403;await assert.rejects(context.AIExaminer.chat([{role:'user',content:'Hello'}]),/không có quyền/);
assert(calls.every(c=>c.url.startsWith('https://generativelanguage.googleapis.com/v1beta/models/')));assert(calls.every(c=>!c.url.includes('?key=')));assert(calls.every(c=>c.options.headers['x-goog-api-key']==='test-key'));assert(calls.every(c=>c.options.credentials==='omit'&&c.options.redirect==='error'));
console.log('PASS: direct Gemini, text/audio, no fabricated pronunciation, explicit503, explicit403, verified BYOK; no local API calls');
})().catch(e=>{console.error(e);process.exitCode=1});
