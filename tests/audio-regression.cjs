const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
let created=0,revoked=0,hide;
const context={window:null,Blob,Promise,Date,Math,Map,URL:{createObjectURL(){return 'blob:'+ ++created;},revokeObjectURL(){revoked++;}},addEventListener(name,fn){hide=fn;}};
context.window=context;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/js/features/history/audio-library.js'),'utf8'),context);
(async()=>{
 let id;
 await assert.rejects(context.BandRoomAudio.store(new Blob(['audio'])),err=>{id=err.audioId;return Boolean(id)&&/tải lại/.test(err.message);});
 const blob=await context.BandRoomAudio.load(id);assert.equal(blob.size,5);
 const elements=[{dataset:{audioId:id},style:{}},{dataset:{audioId:id},style:{}}];
 context.BandRoomAudio.hydrate({querySelectorAll:()=>elements});for(let i=0;i<5;i++)await Promise.resolve();
 assert.equal(created,1,'one object URL reused for same recording');assert.equal(elements[0].src,elements[1].src);
 hide();assert.equal(revoked,1);assert.equal(await context.BandRoomAudio.load('missing'),null);
 context.indexedDB={open(){const req={};queueMicrotask(()=>{req.result={close(){},transaction(){const tx={objectStore(){return {put(){queueMicrotask(()=>{tx.error=new Error('quota exceeded');tx.onabort();});}}}};return tx;}};req.onsuccess();});return req;}};
 await assert.rejects(context.BandRoomAudio.store(new Blob(['again'])),err=>Boolean(err.audioId)&&/quota/.test(err.message));
 console.log('PASS: persistence unavailable/quota failures expose transient audio IDs, cache keeps current grading usable, playback URL reuse and revoke');
})().catch(err=>{console.error(err);process.exitCode=1;});
