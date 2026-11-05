(function (global) {
  'use strict';
  var active = null, revision = 0, pending = null, stage = 'editing', error = null;
  var listeners = new Set();
  function getSnapshot() {
    return Object.freeze({connected:!!active,configured:!!active,verified:!!active,model:active ? active.model : null,
      capabilities:active ? active.capabilities : null,audioInputAccepted:!!active?.capabilities.audioInputAccepted,
      revision:revision,verifying:!!pending,stage:stage,phase:stage,error:error});
  }
  function emit() { var snapshot=getSnapshot(); listeners.forEach(function(fn){try{fn(snapshot);}catch(_){}}); return snapshot; }
  function cancelled() { var e=new Error('Đã hủy xác minh.'); e.name='AbortError'; e.code='ABORTED'; return e; }
  function normalizeError(e) {
    if(e.code==='AUDIO_UNSUPPORTED') return e;
    if(e.name==='AbortError') e.code='ABORTED';
    else if(e.name==='TimeoutError'||e.status===408)e.code='TIMEOUT';
    else e.code=({0:'NETWORK_ERROR',400:'INVALID_REQUEST',401:'INVALID_KEY',403:'ACCESS_DENIED',404:'MODEL_NOT_FOUND',429:'QUOTA_EXCEEDED',502:'INVALID_RESPONSE'})[e.status]||'SERVICE_ERROR';
    return e;
  }
  function cancel() { if(pending){pending.controller.abort();pending=null;revision++;} stage=active?'success':'editing'; error=null;emit(); }
  function silentWav() {
    var bytes=new Uint8Array(32044),view=new DataView(bytes.buffer);
    function tag(at,s){for(var i=0;i<s.length;i++)bytes[at+i]=s.charCodeAt(i);}
    tag(0,'RIFF');view.setUint32(4,32036,true);tag(8,'WAVE');tag(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,16000,true);view.setUint32(28,32000,true);view.setUint16(32,2,true);view.setUint16(34,16,true);tag(36,'data');view.setUint32(40,32000,true);
    var binary=''; for(var i=0;i<bytes.length;i++)binary+=String.fromCharCode(bytes[i]); return global.btoa(binary);
  }
  async function connect(options) {
    cancel();
    var token=++revision,controller=new AbortController(), signal=options.signal;
    var abort=function(){controller.abort();};
    if(signal?.aborted)controller.abort(); signal?.addEventListener('abort',abort,{once:true});
    pending={controller:controller,token:token}; error=null;
    function check(){if(controller.signal.aborted||!pending||pending.token!==token||revision!==token)throw cancelled();}
    function progress(value){check();stage=value;emit();try{options.onProgress?.({stage:value});}catch(_){}}
    try {
      var key=String(options.apiKey||'').trim(),model=String(options.model||'').trim().replace(/^models\//,'');
      if(!key||/\s/.test(key))throw Object.assign(new Error('Hãy nhập API key Gemini hợp lệ.'),{status:401});
      var client=global.BandRoomGemini.create({apiKey:key,model:model,timeoutMs:35000});
      progress('text'); await client.verify(null,controller.signal);check();
      progress('audio'); var audioAccepted=false;
      try {
        await client.verify([{text:'This is a silent test recording. Confirm that you can accept the audio input. Reply briefly; do not assess pronunciation.'},{inlineData:{mimeType:'audio/wav',data:silentWav()}}],controller.signal);
        check(); audioAccepted=true;
      } catch(audioError) {
        check();
        if(audioError.status===400){var unsupported=new Error('Model chưa xác minh được đầu vào audio. Hãy chọn model hỗ trợ audio hoặc kiểm tra cấu hình.');unsupported.code='AUDIO_UNSUPPORTED';throw unsupported;}
        throw audioError;
      }
      check();
      active=Object.freeze({client:client,model:model,capabilities:Object.freeze({text:true,audioInputAccepted:audioAccepted}),revision:token});
      pending=null;stage=audioAccepted?'success':'limited';return emit();
    } catch(e) {
      var safe=normalizeError(e);safe.verificationStage=stage;
      if(pending?.token===token){pending=null;stage=safe.code==='ABORTED'?(active?'success':'editing'):'error';error=safe.code==='ABORTED'?null:{code:safe.code,message:safe.message,status:safe.status||0,verificationStage:safe.verificationStage};emit();}
      throw safe;
    } finally {signal?.removeEventListener('abort',abort);}
  }
  async function discoverModels(options) {
    var key=String(options.apiKey||'').trim();
    if(!key||/\s/.test(key))throw Object.assign(new Error('Hãy nhập API key hợp lệ trước.'),{code:'INVALID_KEY'});
    var result=[],page='',seen=new Set(),controller=new AbortController(),timedOut=false;
    var abort=function(){controller.abort();};
    if(options.signal?.aborted)controller.abort();options.signal?.addEventListener('abort',abort,{once:true});
    var timer=setTimeout(function(){timedOut=true;controller.abort();},15000);
    try {
      for(var count=0;count<10;count++) {
        if(controller.signal.aborted)throw cancelled();
        var response=await global.fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100'+(page?'&pageToken='+encodeURIComponent(page):''),{headers:{'x-goog-api-key':key},credentials:'omit',redirect:'error',signal:controller.signal});
        var payload=await response.json().catch(function(){return null;});
        if(controller.signal.aborted)throw cancelled();
        if(!response.ok){
          var reasons=Array.isArray(payload?.error?.details)?payload.error.details:[];
          if(response.status===401||reasons.some(function(d){return ['API_KEY_INVALID','API_KEY_EXPIRED','API_KEY_NOT_FOUND'].includes(d?.reason);}))throw Object.assign(new Error('API key không hợp lệ hoặc đã hết hiệu lực.'),{status:401});
          throw Object.assign(new Error('Không tải được danh sách model Gemini.'),{status:response.status});
        }
        if(!payload||!Array.isArray(payload.models))throw Object.assign(new Error('Google chưa trả về danh sách model hợp lệ.'),{status:502});
        payload.models.forEach(function(m){
          if(Array.isArray(m.supportedGenerationMethods)&&m.supportedGenerationMethods.includes('generateContent')&&/^models\/[a-zA-Z0-9._-]+$/.test(m.name)&&m.name.length<150&&!seen.has(m.name)){
            seen.add(m.name);var id=m.name.slice(7),label=typeof m.displayName==='string'?m.displayName.slice(0,100):id;
            result.push({id:id,displayName:label.includes(key)?id:label});
          }
        });
        page=typeof payload.nextPageToken==='string'?payload.nextPageToken:'';
        if(!page)return result;
      }
      return result;
    }catch(e){
      if(controller.signal.aborted){if(timedOut)throw Object.assign(new Error('Tải danh sách model quá thời gian chờ.'),{code:'TIMEOUT'});throw cancelled();}
      if(typeof e.status==='number')throw normalizeError(e);
      throw Object.assign(new Error('Không tải được danh sách model. Kiểm tra kết nối mạng.'),{code:'NETWORK_ERROR'});
    }finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort);}
  }
  global.BandRoomGeminiSettings=Object.freeze({connect:connect,getSnapshot:getSnapshot,getConnection:function(){return active;},subscribe:function(fn){listeners.add(fn);return function(){listeners.delete(fn);};},cancel:cancel,disconnect:function(){cancel();active=null;revision++;stage='editing';error=null;emit();},discoverModels:discoverModels});
})(window);
