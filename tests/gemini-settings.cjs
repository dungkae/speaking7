const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
let handler, calls=[];
const denied=status=>({ok:false,status,json:async()=>({error:{}})});
const ok=()=>({ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:'OK'}]}}]})});
const context={setTimeout,clearTimeout,AbortController,DOMException,Uint8Array,DataView,btoa:s=>Buffer.from(s,'binary').toString('base64'),fetch:async(url,options)=>{calls.push({url,options});return handler?handler(url,options):ok();}};
context.window=context;vm.createContext(context);
for(const file of ['gemini-client.js','gemini-settings.js','ai-examiner-chatbot.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/features/examiner',file),'utf8'),context);
(async()=>{
 const settings=context.BandRoomGeminiSettings;
 assert.equal(settings.getConnection(),null);
 await settings.connect({apiKey:'\u200b “secret-one” \u2060',model:'gemini-one'});
 assert(calls.every(call=>call.options.headers['x-goog-api-key']==='secret-one'));
 await assert.rejects(settings.connect({apiKey:'secret-\u200bone',model:'gemini-one'}),e=>e.code==='INVALID_KEY');
 assert.equal(calls.length,2);assert.equal(settings.getSnapshot().audioInputAccepted,true);
 const wav=Buffer.from(JSON.parse(calls[1].options.body).contents[0].parts[1].inlineData.data,'base64');assert.equal(wav.subarray(0,4).toString(),'RIFF');assert.equal(wav.readUInt32LE(40),32000);
 const exhausted=()=>({ok:true,json:async()=>({candidates:[{finishReason:'MAX_TOKENS'}]})});
 handler=async()=>exhausted();
 await settings.connect({apiKey:'secret-thinking',model:'gemini-thinking'});
 assert.equal(settings.getSnapshot().audioInputAccepted,true);
 await assert.rejects(context.AIExaminer.chat([{role:'user',content:'Hello'}]),/chưa hoàn chỉnh/);

 for(const [name,audioFailure] of [
  ['unsupported',()=>denied(400)],
  ['quota',()=>denied(429)],
  ['network',()=>{throw new TypeError('Failed to fetch');}],
 ]){
  let probe=0;handler=async()=>++probe===1?ok():audioFailure();
  await settings.connect({apiKey:'secret-audio',model:'gemini-'+name});
  assert.equal(settings.getSnapshot().stage,'limited');
  assert.equal(settings.getSnapshot().audioInputAccepted,false);
  assert.equal(settings.getConnection().model,'gemini-'+name);
  assert.equal(context.AIExaminer.isOnline(),true);
 }
 const first=settings.getConnection();
 for(const [status,code] of [[401,'INVALID_KEY'],[403,'ACCESS_DENIED']]){
  let probe=0;handler=async()=>++probe===1?ok():denied(status);
  await assert.rejects(settings.connect({apiKey:'secret-denied',model:'gemini-denied'}),e=>e.code===code);
  assert.equal(settings.getConnection(),first);
 }
 handler=async()=>denied(400);
 await assert.rejects(settings.connect({apiKey:'secret-invalid',model:'gemini-invalid'}),e=>e.code==='INVALID_REQUEST');assert.equal(settings.getConnection(),first);
 handler=async()=>denied(429);
 await assert.rejects(settings.connect({apiKey:'secret-two',model:'gemini-two'}),e=>e.code==='QUOTA_EXCEEDED');assert.equal(settings.getConnection(),first);
 handler=async()=>({ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[]}}]})});
 await assert.rejects(settings.connect({apiKey:'secret-two',model:'gemini-two'}),e=>e.code==='INVALID_RESPONSE');assert.equal(settings.getConnection(),first);

 for(const [status,reason,code] of [
  [400,'API_KEY_EXPIRED','INVALID_KEY'],
  [403,'API_KEY_HTTP_REFERRER_BLOCKED','REFERRER_BLOCKED'],
  [403,'SERVICE_DISABLED','API_DISABLED'],
 ]){
  handler=async()=>({ok:false,status,json:async()=>({error:{message:'secret-hidden',details:[{reason}]}})});
  const before=calls.length;
  await assert.rejects(settings.connect({apiKey:'secret-hidden',model:'gemini-one',allowModelFallback:true}),e=>e.code===code&&!e.message.includes('secret-hidden'));
  assert.equal(calls.length,before+1);
 }

 const model=id=>({name:'models/'+id,supportedGenerationMethods:['generateContent']});
 handler=async(url,options)=>{
  if(!options.body)return {ok:true,json:async()=>({models:[model('gemini-unknown'),model('gemini-3.8-flash')]})};
  return url.includes('/gemini-3.8-flash:')?ok():denied(404);
 };
 const missing={apiKey:'secret-missing',model:'gemini-3.5-flash-lite'};
 const beforeMissing=calls.length;
 await assert.rejects(settings.connect(missing),e=>e.code==='MODEL_NOT_FOUND');
 assert.equal(calls.length,beforeMissing+1);
 const beforeFallback=calls.length;
 await settings.connect({...missing,allowModelFallback:true});
 assert.equal(settings.getSnapshot().model,'gemini-3.8-flash');
 const fallbackCalls=calls.slice(beforeFallback);
 assert.equal(fallbackCalls.length,4);
 assert(fallbackCalls[0].url.includes('/gemini-3.5-flash-lite:'));
 assert(fallbackCalls[1].url.includes('/models?pageSize='));
 assert(fallbackCalls.slice(2).every(call=>call.url.includes('/gemini-3.8-flash:')));
 assert(fallbackCalls.every(call=>call.options.headers['x-goog-api-key']===missing.apiKey));
 let release;
 handler=()=>new Promise(resolve=>{release=resolve;});
 const stale=settings.connect({apiKey:'secret-old',model:'gemini-old'});settings.cancel();handler=null;
 await settings.connect({apiKey:'secret-new',model:'gemini-new'});release(ok());
 await assert.rejects(stale,e=>e.code==='ABORTED');assert.equal(settings.getConnection().model,'gemini-new');
 await context.AIExaminer.refreshStatus();assert.equal(context.AIExaminer.isOnline(),true);
 // One grading run retains its verified client even when settings switch between answers.
 const schemaReview={transcript:'I like books.',criteria:{fluency_coherence:6,lexical_resource:6,grammatical_range_accuracy:6,pronunciation:null},corrected_answer:'I like books.',natural_answer:'I enjoy reading.',summary_vi:'Review',feedback_vi:[],pronunciation_notes_vi:[],word_feedback:[]};
 let grades=0;const gradeKeys=[];
 handler=async(url,options)=>{if(JSON.parse(options.body).generationConfig.responseSchema){gradeKeys.push(options.headers['x-goog-api-key']);if(++grades===1)await settings.connect({apiKey:'private-replacement-key',model:'gemini-replacement'});return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(schemaReview)}]}}]})};}return ok();};
 await context.AIExaminer.gradeAnswers({1:[{question:'Q1',text:'I like books.'},{question:'Q2',text:'I like books.'}]},'part',1);
 assert.deepEqual(gradeKeys,['secret-new','secret-new']);
 assert(!JSON.stringify(settings.getSnapshot()).includes('private-replacement-key'));assert(!JSON.stringify(settings.getConnection()).includes('private-replacement-key'));
 settings.disconnect();assert.equal(context.AIExaminer.isOnline(),false);
 assert(calls.every(c=>!c.url.includes('secret-')));
 console.log('PASS: verified BYOK, valid WAV, probe truncation, audio-limited sessions, vetted model fallback, cancellation, immutable batch client');
})().catch(e=>{console.error(e);process.exitCode=1});
