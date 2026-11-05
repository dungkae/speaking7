(function (global) {
  'use strict';
  var initialized=false,overlay,card,form,panel,title,status,details,icon;
  var keyInput,modelSelect,customWrap,customModel,formError,activeInfo;
  var reveal,verifyButton,closeButton,editButton,disconnectButton;
  var attempt=0,controller=null,invoker=null;
  var modelsAttempt=0,modelsAbort=null,loadModelsButton,modelListStatus;
  var modelChosenByUser=false,defaultModelIds=[];
  var busyCheck=function(){return false;};
  function byId(id){return document.getElementById(id);}
  function service(){return global.BandRoomGeminiSettings;}
  function snapshot(){var s=service();return s&&s.getSnapshot?s.getSnapshot():{connected:false,model:null};}
  function opened(){return overlay&&overlay.classList.contains('show');}
  function selectedModel(){return(modelSelect.value==='custom'?customModel.value:modelSelect.value).trim().replace(/^models\//,'');}
  function draftKey(){
    if(!keyInput.value.trim()){message('Bạn cần nhập API key của mình.');keyInput.focus();return null;}
    if(!global.BandRoomGemini?.normalizeApiKey){message('Chức năng kết nối chưa tải xong. Hãy tải lại trang.');return null;}
    try{return global.BandRoomGemini.normalizeApiKey(keyInput.value);}
    catch(error){message(failureText(error));keyInput.focus();return null;}
  }
  function clearDraft(){keyInput.value='';keyInput.type='password';reveal.setAttribute('aria-pressed','false');reveal.textContent='Hiện';}
  function updateActive(){
    if(!initialized)return;
    var s=snapshot();
    activeInfo.textContent=s.connected
      ?'Đang dùng: '+s.model+'. '+(s.audioInputAccepted?'Đã xác minh đầu vào âm thanh.':'Đã kết nối để chat và chấm transcript.')
      :'Chưa kết nối Gemini. Bạn vẫn có thể luyện nói và lưu bản ghi.';
    disconnectButton.hidden=!s.connected||card.dataset.state!=='editing';
  }
  function setModel(model){var found=false;Array.prototype.forEach.call(modelSelect.options,function(option){if(option.value===model)found=true;});modelSelect.value=found?model:'custom';customModel.value=found?'':model;customWrap.hidden=modelSelect.value!=='custom';}
  function stopModels(){modelsAttempt+=1;if(modelsAbort){modelsAbort.abort();modelsAbort=null;}if(loadModelsButton)loadModelsButton.disabled=false;if(modelSelect)modelSelect.disabled=false;if(verifyButton)verifyButton.disabled=false;if(modelListStatus)modelListStatus.textContent='';}
  function stopAttempt(){stopModels();attempt+=1;if(controller){controller.abort();controller=null;}if(service()&&service().cancel)service().cancel();}
  function message(text){formError.textContent=text||'';formError.hidden=!text;}
  function showEditing(){card.dataset.state='editing';form.hidden=false;panel.hidden=true;title.textContent='Kết nối Gemini của bạn';status.textContent='Dán API key, chọn model và xác minh trước khi chấm bài.';closeButton.textContent='Đóng';closeButton.classList.remove('gemini-primary-action');editButton.hidden=true;verifyButton.disabled=false;updateActive();}
  function statusIcon(kind){
    icon.replaceChildren();
    if(kind==='verifying'){var spinner=document.createElement('span');spinner.className='gemini-spinner';spinner.setAttribute('aria-hidden','true');icon.appendChild(spinner);return;}
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');
    var path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',kind==='success'?'m5 12 4 4L19 6':'M12 5v8m0 5h.01');svg.appendChild(path);icon.appendChild(svg);
  }
  function showProgress(model,stage){form.hidden=true;panel.hidden=false;card.dataset.state='verifying';title.textContent='Đang xác minh Gemini';status.textContent='Đang kiểm tra kết nối với '+model+'.';details.textContent=stage==='audio'?'Kiểm tra model có nhận đầu vào âm thanh.':stage==='discovery'?'Đang tìm model khác dùng được với key này.':'Gửi một yêu cầu thử để xác minh key và model.';closeButton.textContent='Hủy xác minh';editButton.hidden=true;disconnectButton.hidden=true;statusIcon('verifying');}
  function failureText(error){
    var code=String(error&&error.code||'').toUpperCase();
    if(['REFERRER_BLOCKED','API_DISABLED','BILLING_OR_REGION','INVALID_REQUEST'].includes(code)&&error.message)return error.message;
    if(/AUDIO/.test(code))return'Chưa xác minh được đầu vào âm thanh. Hãy chọn model hỗ trợ âm thanh và thử lại.';
    if(/KEY|AUTH|401/.test(code))return error.message||'API key không hợp lệ hoặc đã hết hiệu lực. Hãy kiểm tra Auth key trong Google AI Studio.';
    if(/QUOTA|RATE|429/.test(code))return'Key hoặc model đã hết hạn mức, hoặc đang bị giới hạn tốc độ. Hãy kiểm tra quota rồi thử lại.';
    if(/PERMISSION|ACCESS|403/.test(code))return'Key chưa có quyền dùng model này. Hãy kiểm tra giới hạn của key hoặc chọn model khác.';
    if(/MODEL|404/.test(code))return'Không tìm thấy model hoặc key chưa có quyền dùng model này. Hãy kiểm tra mã model.';
    if(/INVALID_REQUEST/.test(code))return'Model không hỗ trợ yêu cầu này hoặc cấu hình chưa hợp lệ. Hãy kiểm tra mã model.';
    if(/TIMEOUT/.test(code))return'Gemini chưa phản hồi trong thời gian chờ. Bạn có thể thử lại.';
    if(/NETWORK|FETCH|CONNECT/.test(code))return'Chưa kết nối được Google Gemini. Hãy kiểm tra mạng rồi thử lại.';
    if(/RESPONSE|OUTPUT/.test(code))return'Gemini chưa trả về phản hồi kiểm tra hợp lệ. Kết nối chưa được kích hoạt.';
    return'Chưa xác minh được key và model. Hãy kiểm tra cấu hình hoặc thử lại.';
  }
  function showResult(kind,text,model){
    card.dataset.state=kind;form.hidden=true;panel.hidden=false;
    var connected=kind==='success'||kind==='limited';
    title.textContent=kind==='success'?'Đã kết nối Gemini':kind==='limited'?'Đã kết nối Gemini ở chế độ văn bản':'Chưa thể kết nối';
    status.textContent=text;
    var s=snapshot();
    if(kind==='success')details.textContent='Model: '+model+'. Đã kiểm tra phản hồi văn bản và đầu vào âm thanh.';
    else if(kind==='limited')details.textContent='Model: '+model+'. '+(s.error?failureText(s.error):'Bạn có thể đổi model để dùng chấm âm thanh.');
    else details.textContent=s.connected?'Kết nối đang dùng '+s.model+' vẫn được giữ.':'Chưa có kết nối được kích hoạt.';
    statusIcon(kind);editButton.hidden=kind==='success';editButton.textContent='Sửa key hoặc model';
    closeButton.textContent=connected?'Tiếp tục luyện nói':'Đóng';
    closeButton.classList.toggle('gemini-primary-action',connected);disconnectButton.hidden=true;title.focus();
  }
  async function verify(){
    if(!opened()||card.dataset.state==='verifying')return;
    message('');
    if(busyCheck()){message('Hãy dừng ghi âm hoặc đợi xử lý bài xong trước khi đổi kết nối.');return;}
    var candidate={apiKey:draftKey(),model:selectedModel()};
    if(!candidate.apiKey)return;
    if(!candidate.model){message('Bạn cần chọn hoặc nhập mã model.');(modelSelect.value==='custom'?customModel:modelSelect).focus();return;}
    if(!service()||!service().connect){message('Chức năng kết nối chưa tải xong. Hãy tải lại trang.');return;}
    stopAttempt();var current=++attempt;controller=new AbortController();var signal=controller.signal;
    showProgress(candidate.model,'text');title.focus();
    try{
      var result=await service().connect({
        apiKey:candidate.apiKey,model:candidate.model,signal:signal,allowModelFallback:!modelChosenByUser,
        onProgress:function(progress){
          if(!opened()||current!==attempt||signal.aborted)return;
          showProgress(progress?.model||candidate.model,typeof progress==='string'?progress:progress?.stage);
        }
      });
      if(!opened()||current!==attempt||signal.aborted)return;controller=null;
      if(!result?.connected){showResult('error','Chưa xác minh được key và model.',candidate.model);return;}
      var model=result.model||candidate.model;
      clearDraft();setModel(model);updateActive();
      if(!result.capabilities?.audioInputAccepted){
        showResult('limited','Đã kết nối để chat và chấm transcript. Chưa xác minh được đầu vào âm thanh.',model);
        return;
      }
      showResult('success','Key và model đã phản hồi hợp lệ. Bạn có thể dùng kết nối này để chấm bài.',model);
    }catch(error){if(!opened()||current!==attempt||signal.aborted)return;controller=null;showResult('error',failureText(error),candidate.model);}
  }
  async function loadModels(){
    stopAttempt();message('');
    var key=draftKey();
    if(!key)return;
    if(!service()||!service().discoverModels){message('Chưa tải được chức năng lấy model. Hãy thử lại.');return;}
    var current=++modelsAttempt,aborter=new AbortController(),previous=selectedModel();
    var keepCustom=modelChosenByUser&&modelSelect.value==='custom'&&previous;
    modelsAbort=aborter;
    loadModelsButton.disabled=true;modelSelect.disabled=true;verifyButton.disabled=true;modelListStatus.textContent='Đang lấy danh sách…';
    try{
      var models=await service().discoverModels({apiKey:key,signal:aborter.signal});
      if(current!==modelsAttempt||aborter.signal.aborted||!opened())return;
      if(!models.length){modelListStatus.textContent='Không có model hỗ trợ generateContent.';return;}
      modelSelect.replaceChildren();
      models.forEach(function(model){var option=document.createElement('option');option.value=model.id;option.textContent=model.displayName;modelSelect.appendChild(option);});
      var custom=document.createElement('option');custom.value='custom';custom.textContent='Nhập model khác…';modelSelect.appendChild(custom);
      var available=models.some(function(model){return model.id===previous;});
      if(available||keepCustom)setModel(previous);
      else {
        var recommended=defaultModelIds.find(function(id){return models.some(function(model){return model.id===id;});});
        modelChosenByUser=false;
        setModel(recommended||'');
      }
      modelListStatus.textContent='Đã tải '+models.length+' model từ Google. '+(selectedModel()?'':'Hãy chọn một model để kiểm tra.');
    }catch(error){if(current!==modelsAttempt||aborter.signal.aborted||!opened())return;modelListStatus.textContent='Chưa tải được danh sách.';message(failureText(error));}
    finally{if(current===modelsAttempt){modelsAbort=null;loadModelsButton.disabled=false;modelSelect.disabled=false;verifyButton.disabled=false;}}
  }
  function draftChanged(event){if(event.currentTarget!==keyInput)modelChosenByUser=true;stopAttempt();message('');customWrap.hidden=modelSelect.value!=='custom';if(card.dataset.state!=='editing')showEditing();}
  function focusable(){return Array.prototype.filter.call(card.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]'),function(element){return element.getClientRects().length&&global.getComputedStyle(element).visibility!=='hidden';});}
  function open(source){init();if(!initialized||opened())return;invoker=source&&typeof source.focus==='function'?source:document.activeElement;stopAttempt();clearDraft();message('');var s=snapshot();if(s.connected&&s.model){modelChosenByUser=false;setModel(s.model);}showEditing();document.body.classList.remove('menu-open');overlay.classList.add('show');document.body.classList.add('gemini-dialog-open');keyInput.focus();}
  function close(){if(!initialized)return;stopAttempt();clearDraft();message('');overlay.classList.remove('show');document.body.classList.remove('gemini-dialog-open');var target=invoker&&invoker.isConnected&&invoker.getClientRects().length?invoker:byId('settingsBtn');if(target&&target.getClientRects().length)target.focus();invoker=null;}
  function init(){
    if(initialized)return;
    overlay=byId('modalOverlay');card=byId('geminiSettingsDialog');form=byId('geminiSettingsForm');if(!overlay||!card||!form)return;
    title=byId('settingsTitle');status=byId('serverSettingsStatus');panel=byId('geminiVerificationPanel');details=byId('geminiVerificationDetails');icon=byId('geminiStatusIcon');
    keyInput=byId('geminiApiKey');modelSelect=byId('geminiModel');defaultModelIds=Array.from(modelSelect.options,function(option){return option.value;}).filter(function(id){return id!=='custom';});customWrap=byId('geminiCustomModelRow');customModel=byId('geminiCustomModel');formError=byId('geminiFormError');activeInfo=byId('geminiActiveConnection');
    reveal=byId('toggleGeminiKey');verifyButton=byId('testGeminiBtn');closeButton=byId('closeModalBtn');editButton=byId('editGeminiBtn');disconnectButton=byId('disconnectGeminiBtn');initialized=true;loadModelsButton=byId('loadGeminiModelsBtn');modelListStatus=byId('geminiModelListStatus');if(loadModelsButton)loadModelsButton.addEventListener('click',loadModels);
    form.addEventListener('submit',function(event){event.preventDefault();verify();});keyInput.addEventListener('input',draftChanged);modelSelect.addEventListener('change',draftChanged);customModel.addEventListener('input',draftChanged);
    reveal.addEventListener('click',function(){var visible=keyInput.type==='password';keyInput.type=visible?'text':'password';reveal.setAttribute('aria-pressed',String(visible));reveal.textContent=visible?'Ẩn':'Hiện';keyInput.focus();});
    editButton.addEventListener('click',function(){stopAttempt();showEditing();message('');keyInput.focus();});closeButton.addEventListener('click',close);
    disconnectButton.addEventListener('click',function(){if(busyCheck()){message('Hãy đợi xử lý bài xong trước khi ngắt kết nối.');return;}stopAttempt();if(service()&&service().disconnect)service().disconnect();clearDraft();showEditing();message('Đã ngắt kết nối Gemini.');keyInput.focus();});
    overlay.addEventListener('click',function(event){if(event.target===overlay)close();});
    var button=byId('settingsBtn');if(button)button.addEventListener('click',function(){open(document.activeElement);});
    document.addEventListener('keydown',function(event){if(!opened())return;if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}if(event.key!=='Tab')return;var items=focusable();if(!items.length){event.preventDefault();title.focus();return;}var first=items[0],last=items[items.length-1],active=document.activeElement;if(event.shiftKey&&(active===first||!card.contains(active)||active===title)){event.preventDefault();last.focus();}else if(!event.shiftKey&&(active===last||!card.contains(active)||active===title)){event.preventDefault();first.focus();}});
    global.addEventListener('pagehide',function(){stopAttempt();clearDraft();});if(service()&&service().subscribe)service().subscribe(updateActive);showEditing();
  }
  global.BandRoomSettingsUI={init:init,open:open,close:close,verify:verify,configure:function(options){if(options&&typeof options.isBusy==='function')busyCheck=options.isBusy;}};init();
})(window);
