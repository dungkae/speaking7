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
    if(e.code) return e;
    if(e.name==='AbortError') e.code='ABORTED';
    else if(e.name==='TimeoutError'||e.status===408)e.code='TIMEOUT';
    else e.code=({0:'NETWORK_ERROR',400:'INVALID_REQUEST',401:'INVALID_KEY',403:'ACCESS_DENIED',404:'MODEL_NOT_FOUND',429:'QUOTA_EXCEEDED',502:'INVALID_RESPONSE'})[e.status]||'SERVICE_ERROR';
    return e;
  }
  function idleStage() { return active?(active.capabilities.audioInputAccepted?'success':'limited'):'editing'; }
  function cancel() { if(pending){pending.controller.abort();pending=null;revision++;} stage=idleStage(); error=active?.audioWarning||null;emit(); }
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
    function progress(value){check();stage=value;emit();try{options.onProgress?.({stage:value,model:model});}catch(_){}}
    try {
      var key=global.BandRoomGemini.normalizeApiKey(options.apiKey),model=String(options.model||'').trim().replace(/^models\//,'');
      var client=global.BandRoomGemini.create({apiKey:key,model:model,timeoutMs:35000});
      progress('text');
      try {
        await client.verify(null,controller.signal);
      } catch (textError) {
        check();
        if(textError.status!==404||!options.allowModelFallback)throw textError;
        progress('discovery');
        var models=await discoverModels({apiKey:key,signal:controller.signal});
        check();
        var fallback=['gemini-3.5-flash-lite','gemini-3.8-flash'].find(function(id){
          return id!==model&&models.some(function(entry){return entry.id===id;});
        });
        if(!fallback)throw textError;
        model=fallback;
        client=global.BandRoomGemini.create({apiKey:key,model:model,timeoutMs:35000});
        progress('text');
        await client.verify(null,controller.signal);
      }
      check();
      progress('audio'); var audioAccepted=false, audioWarning=null;
      try {
        await client.verify([{text:'This is a silent test recording. Confirm that you can accept the audio input. Reply briefly; do not assess pronunciation.'},{inlineData:{mimeType:'audio/wav',data:silentWav()}}],controller.signal);
        check(); audioAccepted=true;
      } catch(audioError) {
        check();
        if(![0,400,408,429,500,502,503,504].includes(audioError.status))throw audioError;
        var warning=normalizeError(audioError);
        audioWarning=Object.freeze({code:warning.code,message:warning.message});
      }
      check();
      active=Object.freeze({client:client,model:model,capabilities:Object.freeze({text:true,audioInputAccepted:audioAccepted}),revision:token,audioWarning:audioWarning});
      pending=null;stage=audioAccepted?'success':'limited';error=audioWarning;return emit();
    } catch(e) {
      var safe=normalizeError(e);
      if(pending?.token===token){pending=null;stage=safe.code==='ABORTED'?idleStage():'error';error=safe.code==='ABORTED'?(active?.audioWarning||null):{code:safe.code,message:safe.message};emit();}
      throw safe;
    } finally {signal?.removeEventListener('abort',abort);}
  }
  async function discoverModels(options) {
    var key=global.BandRoomGemini.normalizeApiKey(options.apiKey);
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
        if(!response.ok)throw global.BandRoomGemini.responseError(response.status,payload);
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
