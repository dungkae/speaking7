const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
let recognition, recorder, permissionResolve, tracksStopped=false;
class Recognition {
 constructor(){recognition=this;}
 start(){}
 stop(){setTimeout(()=>{this.onresult({results:[Object.assign([{transcript:'Final words after stop'}],{isFinal:true})]});this.onend();},10);}
}
class Recorder {
 constructor(){recorder=this;this.state='inactive';}
 static isTypeSupported(){return true;}
 start(){this.state='recording';}
 stop(){this.state='inactive';setTimeout(()=>{this.ondataavailable({data:new Blob(['sample'])});this.onstop();},1);}
}
const context={window:null,MediaRecorder:Recorder,SpeechRecognition:Recognition,Blob,Promise,Uint8Array,setTimeout,clearTimeout,requestAnimationFrame:()=>1,cancelAnimationFrame(){},navigator:{mediaDevices:{getUserMedia:()=>new Promise(resolve=>{permissionResolve=resolve;})}}};
context.window=context;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/js/features/speaking/speech-to-text.js'),'utf8'),context);
(async()=>{
 const speech=context.SpeechToText;
 const pending=speech.start();
 await assert.rejects(speech.start(),/Đang có/);
 permissionResolve({getTracks:()=>[{stop(){tracksStopped=true;}}]});
 await pending;
 const result=await speech.stop();
 assert.equal(result.text,'Final words after stop');assert.equal(result.source,'browser');
 assert.equal(speech.takeLastAudioBlob().size,6);assert.equal(tracksStopped,true);
 assert.equal(typeof speech.getApiKey,'undefined');
 console.log('PASS: rejects concurrent permission requests, captures final recognition on stop, preserves audio and releases tracks, no client API credentials');
})().catch(err=>{console.error(err);process.exitCode=1;});
