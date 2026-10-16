/* Bộ điều khiển giao diện: phiên thi, hiển thị câu hỏi, lịch sử và chat. */
(function(){
  "use strict";

  var TOPICS = window.BandRoomData.TOPICS;

  var MAX_SECONDS = { 1:45, 2:120, 3:60 };
  var PREP_SECONDS = 60;

  var state = {
    topic: TOPICS.find(function(t){try{return t.name===localStorage.getItem('band_room_selected_topic')}catch(e){return false}})||TOPICS[Math.floor(Math.random()*TOPICS.length)],
    part: 1,
    qIndex: 0,
    answersByPart: { 1:[], 2:[], 3:[] },
    mode: 'part',
    interimText: "",
    recognizing: false,
    processing: false,
    prepping: false,
    timerId: null,
    remaining: 0,
    chat: [],
    helperView: 'ideas',
    reviewBusy: false,
    starting: false,
    gradingBusy: false
  };

  function busy(){ return state.starting || state.recognizing || state.processing || state.prepping || state.reviewBusy || state.gradingBusy; }
  function band(value){ return value == null || !Number.isFinite(Number(value)) ? 'Chưa đánh giá' : Number(value).toFixed(1); }
  function snapshot(){ return {userId:CURRENT_USER&&CURRENT_USER.uid||'guest',topic:state.topic.name,part:state.part,answers:JSON.parse(JSON.stringify(state.answersByPart))}; }
  function clearReview(){ if(reviewPanel){reviewPanel.classList.remove('show');reviewPanel.innerHTML='';} }
  function el(id){ return document.getElementById(id); }
  var qIndexEl = el('qIndex'), qTextEl = el('qText'), qBulletsEl = el('qBullets');
  var micBtn = el('micBtn'), timerEl = el('timer'), statusEl = el('statusText');
  var onairEl = el('onairLight'), brandDot = el('brandDot');
  var nextBtn = el('nextBtn'), redoBtn = el('redoBtn'), sendToBotBtn = el('sendToBotBtn');
  var topicPill = el('topicPill'), partNav = el('partNav');
  var canvas = el('wave'), ctx = canvas.getContext('2d');
  var livePreview = el('livePreview'), answerListEl = el('answerList');
  var chatScroll = el('chatScroll'), chatInput = el('chatInput'), chatSendBtn = el('chatSendBtn');
  var quickChips = el('quickChips');
  var keyStatus = el('keyStatus'), keyStatusText = el('keyStatusText');
  var settingsBtn = el('settingsBtn'), modalOverlay = el('modalOverlay');
  var closeModalBtn = el('closeModalBtn');
  var speakBtn = el('speakBtn'), modePill = el('modePill');
  var fileWarn = el('fileWarn');
  var suggestedWords = el('suggestedWords'), helperTabs = el('helperTabs'), helperContent = el('helperContent');
  var reviewPanel = el('reviewPanel'), mobileMicBtn = el('mobileMicBtn'), mobileMicLabel = el('mobileMicLabel'), keyboardBtn = el('keyboardBtn');
  var backBtn = el('backBtn'), newSessionBtn = el('newSessionBtn'), historyNavBtn = el('historyNavBtn'), themeBtn = el('themeBtn');
  var menuBtn = el('menuBtn'), sideMenu = el('sideMenu'), sideCloseBtn = el('sideCloseBtn'), drawerScrim = el('drawerScrim');
  var mobileHistoryBtn = el('mobileHistoryBtn'), mobilePartLabel = el('mobilePartLabel');
  var practiceNavBtn = el('practiceNavBtn'), examinerNavBtn = el('examinerNavBtn'), practicePanel = el('practicePanel'), aiPanel = el('aiPanel');
  var sideThemeBtn = el('sideThemeBtn'), sideSettingsBtn = el('sideSettingsBtn'), partPickerSection = el('partPickerSection');

  // Phát hiện mở bằng file:// — trường hợp trình duyệt sẽ chặn gọi API.
  if (fileWarn && typeof location !== 'undefined' && location.protocol === 'file:') {
    fileWarn.style.display = 'block';
  }

  if (!SpeechToText.hasRecording) {
    el('compatNote').innerHTML = '⚠️ Trình duyệt của bạn không hỗ trợ ghi âm (MediaRecorder). Vui lòng dùng một trình duyệt hiện đại như Chrome, Edge, Firefox hoặc Safari mới.';
    el('compatNote').style.color = 'var(--red)';
  }

  topicPill.textContent = state.topic.name;
  var topicSelect = el('topicSelect'), shuffleTopicBtn = el('shuffleTopicBtn');
  if(el('topicCount'))el('topicCount').textContent=String(TOPICS.length);
  if(topicSelect){
    TOPICS.forEach(function(topic,index){var option=document.createElement('option');option.value=String(index);option.textContent=topic.name;topicSelect.appendChild(option);});
    topicSelect.value=String(TOPICS.indexOf(state.topic));
  }
  function setTopic(topic){
    if(!topic || busy()){if(topicSelect)topicSelect.value=String(TOPICS.indexOf(state.topic));return;}
    stopSpeaking();clearReview();
    state.topic=topic;state.part=1;state.qIndex=0;state.answersByPart={1:[],2:[],3:[]};
    topicPill.textContent=topic.name;
    if(mobilePartLabel)mobilePartLabel.textContent='Part 1 · Speaking';
    document.querySelectorAll('.part-btn').forEach(function(b){b.classList.toggle('active',Number(b.dataset.part)===1);});
    if(topicSelect)topicSelect.value=String(TOPICS.indexOf(topic));
    try{localStorage.setItem('band_room_selected_topic',topic.name);}catch(e){}
    renderQuestion();renderAnswerList();updateSubmitButtons();
  }
  if(topicSelect)topicSelect.addEventListener('change',function(){setTopic(TOPICS[Number(topicSelect.value)]);});
  if(shuffleTopicBtn)shuffleTopicBtn.addEventListener('click',function(){var pool=TOPICS.filter(function(t){return t!==state.topic;});setTopic(pool[Math.floor(Math.random()*pool.length)]);});


  function escapeHtml(s){
    return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }


  var closeSideMenu = window.BandRoomNavigation.close;

  // ============ QUESTION SUPPORT (offline, free) ============

  function supportForQuestion(){
    return window.BandRoomQuestionAssist.forQuestion(currentQuestionText(),state.topic,state.part);
  }

  function assistListHtml(title, items, note){
    return '<div class="assist-title">'+escapeHtml(title)+'</div>'+
      '<ul class="assist-list">'+items.map(function(x){return '<li>'+escapeHtml(x)+'</li>';}).join('')+'</ul>'+
      (note?'<div class="assist-note">'+escapeHtml(note)+'</div>':'');
  }
  function renderQuestionAssist(){
    if(!suggestedWords || !helperContent) return;
    var sup=supportForQuestion();
    suggestedWords.innerHTML=sup.words.map(function(w){return '<span class="word-chip">'+escapeHtml(w)+'</span>';}).join('');
    var view=state.helperView || 'ideas';
    if(view==='translate'){
      helperContent.innerHTML='<div class="assist-title">Nghĩa câu hỏi</div><p class="question-translation" lang="vi">'+escapeHtml(sup.translation)+'</p>'+
        (sup.translatedBullets.length?'<div class="assist-note">Bạn nên nói về:</div><ul class="assist-list" lang="vi">'+sup.translatedBullets.map(function(text){return '<li>'+escapeHtml(text)+'</li>';}).join('')+'</ul>':'');
    }else if(view==='hint') helperContent.innerHTML=assistListHtml('Cách triển khai câu trả lời',sup.hints,'Dùng khung câu để bắt đầu, rồi diễn đạt bằng lời của bạn.');
    else helperContent.innerHTML=assistListHtml('Một vài hướng để kể',sup.ideas,'Chọn ý gần với trải nghiệm của bạn; không cần dùng tất cả.');
    helperContent.scrollTop=0;
    helperContent.classList.remove('soft-swap'); void helperContent.offsetWidth; helperContent.classList.add('soft-swap');
    if(helperTabs) helperTabs.querySelectorAll('.helper-tab').forEach(function(b){
      var active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
    });
  }
  if(helperTabs) helperTabs.addEventListener('click',function(e){var b=e.target.closest('.helper-tab');if(!b)return;state.helperView=b.dataset.view;renderQuestionAssist();});

  var storeAudioBlob = window.BandRoomAudio.store;
  var loadAudioBlob = window.BandRoomAudio.load;
  var hydrateAudioElements = window.BandRoomAudio.hydrate;

  function practiceKey(userId){return 'band_room_practice_v3_'+(userId || (CURRENT_USER&&CURRENT_USER.uid?CURRENT_USER.uid:'guest'));}
  function readPracticeHistory(userId){
    try{
      var key=practiceKey(userId), raw=localStorage.getItem(key);
      if(!raw)raw=localStorage.getItem(key.replace('_v3_','_v2_'));
      var result=JSON.parse(raw||'[]');return Array.isArray(result)?result:[];
    }catch(e){return[];}
  }
  function savePracticeSnapshot(report,modeVal,partVal,submission){
    submission=submission||snapshot();
    var answers={1:[],2:[],3:[]}; [1,2,3].forEach(function(p){answers[p]=(submission.answers[p]||[]).filter(Boolean).map(function(a){return {question:a.question,text:a.text,seconds:a.seconds,source:a.source,audioId:a.audioId||'',audioTransient:!!a.audioTransient,review:a.review||null};});});
    var rec={id:'p_'+Date.now(),createdAt:Date.now(),topic:submission.topic,mode:modeVal,part:String(partVal),report:report||'',answers:answers};
    var arr=readPracticeHistory(submission.userId);arr.unshift(rec);arr=arr.slice(0,30);try{localStorage.setItem(practiceKey(submission.userId),JSON.stringify(arr))}catch(e){};
    return rec;
  }

  function issueMap(review){var map={};(review&&review.word_feedback||[]).forEach(function(x){if(!x||x.status!=='issue')return;String(x.token||'').toLowerCase().match(/[a-z']+/g)?.forEach(function(w){map[w]={replacement:x.replacement||'',reason:x.reason_vi||''};});});return map;}
  function renderTokens(text,review){
    var issues=issueMap(review); return String(text||'').split(/(\s+)/).map(function(piece){if(/^\s+$/.test(piece))return piece;var m=piece.toLowerCase().match(/[a-z']+/);var key=m?m[0]:'';var inf=issues[key];var cls=inf?'issue':'neutral';var title=inf?(inf.reason+(inf.replacement?' → '+inf.replacement:'')):'';return '<span class="tok '+cls+'"'+(title?' title="'+escapeHtml(title)+'"':'')+'>'+escapeHtml(piece)+'</span>';}).join('');
  }
  function renderReview(review,answer){
    if(!reviewPanel)return; var c=review.criteria||{};
    reviewPanel.classList.add('show');
    reviewPanel.innerHTML='<div class="review-head"><div><div class="review-title">Đánh giá câu trả lời</div><div class="review-note">'+escapeHtml(review.summary_vi||'')+'</div></div><div class="band-badge">'+band(review.overall)+'</div></div>'+ 
      '<div class="criteria-grid">'+
      '<div class="criterion"><small>Fluency & Coherence</small><strong>'+band(c.fluency_coherence)+'</strong></div>'+ 
      '<div class="criterion"><small>Lexical Resource</small><strong>'+band(c.lexical_resource)+'</strong></div>'+ 
      '<div class="criterion"><small>Grammar</small><strong>'+band(c.grammatical_range_accuracy)+'</strong></div>'+ 
      '<div class="criterion"><small>Pronunciation</small><strong>'+band(c.pronunciation)+'</strong></div></div>'+ 
      '<div class="token-box">'+renderTokens(answer.text||'',review)+'</div>'+ 
      '<div class="corrected"><b>Gợi ý sửa:</b> <u>'+escapeHtml(review.corrected_answer||'Chưa có đánh giá AI')+'</u><br><b>Tự nhiên hơn:</b> '+escapeHtml(review.natural_answer||'')+'</div>'+ 
      '<ul class="feedback-list">'+(review.feedback_vi||[]).map(function(x){return '<li>'+escapeHtml(x)+'</li>';}).join('')+'</ul>'+ 
      '<div class="review-note">'+(review.used_audio?'🎧 Pronunciation có dùng audio thật để phân tích.':'📝 Chưa đánh giá Pronunciation: cần audio để chấm tiêu chí này.')+'</div>';
    reviewPanel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  // Trạng thái cấu hình Gemini cho bản Go Live cá nhân.
  function refreshKeyStatus(){
    var online=AIExaminer.isOnline();
    if(keyStatus)keyStatus.classList.toggle('on',online);
    if(keyStatusText)keyStatusText.textContent=online?'Gemini: đã có cấu hình':'Chưa có cấu hình Gemini';
    if(el('serverSettingsStatus'))el('serverSettingsStatus').textContent=online?'Gemini được gọi trực tiếp từ trình duyệt. Cấu hình đã có khóa; trạng thái này không xác nhận hạn mức API.':'Chưa có khóa. Kiểm tra env.js.';
    if(modePill)modePill.textContent=online?'Chế độ: Gemini trực tiếp':'Chế độ: luyện tập, chưa chấm AI';
  }
  if(el('testGeminiBtn'))el('testGeminiBtn').addEventListener('click',function(){
    var button=el('testGeminiBtn'),note=el('serverSettingsStatus');button.disabled=true;note.textContent='Đang gọi thử Gemini…';
    AIExaminer.testConnection().then(function(model){note.textContent='Kết nối thành công. Model: '+model;}).catch(function(error){note.textContent=error.message;}).finally(function(){button.disabled=false;});
  });
  function openSettings(){ if(modalOverlay)modalOverlay.classList.add('show');refreshKeyStatus(); }
  function closeSettings(){ if(modalOverlay)modalOverlay.classList.remove('show'); }
  if(settingsBtn)settingsBtn.addEventListener('click',openSettings);
  if(closeModalBtn)closeModalBtn.addEventListener('click',closeSettings);
  if(modalOverlay)modalOverlay.addEventListener('click',function(e){if(e.target===modalOverlay)closeSettings();});
  refreshKeyStatus();
  Promise.resolve(window.BandRoomExaminerReady).then(refreshKeyStatus);

  // ============ ĐĂNG NHẬP + LỊCH SỬ (Firebase) ============
  var appEl = document.querySelector('.app');
  var CURRENT_USER = null;
  var userPill = el('userPill'), userEmailEl = el('userEmail'), logoutBtn = el('logoutBtn');
  var subMode = el('subMode'), sendFullBtn = el('sendFullBtn'), subProgress = el('subProgress');
  var historyPanel = el('historyPanel'), historyBody = el('historyBody');

  if (typeof BRAuth !== 'undefined') {
    var authResolved = false;
    var authNotice = el('authNotice');
    // Firebase có thể mất kết nối: không che toàn bộ giao diện khi callback chưa tới.
    setTimeout(function () {
      if (!authResolved && authNotice) authNotice.hidden = false;
    }, 5000);
    BRAuth.ready(function(user){
      authResolved = true;
      if (authNotice) authNotice.hidden = true;
      if (!user) { location.replace('login.html'); return; }
      CURRENT_USER = user;
      if (userEmailEl) userEmailEl.textContent = user.email;
      if (userPill) userPill.style.display = '';
      if (logoutBtn) logoutBtn.style.display = '';
      loadAndRenderHistory();
    });
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(){
        BRAuth.signOut().then(function(){ location.replace('login.html'); });
      });
    }
  }

  function partHasContent(p){
    var a = state.answersByPart[p] || [];
    return a.filter(Boolean).some(function(x){ return x && ((x.text||'').trim() || x.audioId); });
  }
  function updateSubmitButtons(){
    var cur = state.answersByPart[state.part] || [];
    var hasCur = cur.filter(Boolean).some(function(x){ return x && ((x.text||'').trim() || x.audioId); });
    document.querySelectorAll('#answerList textarea').forEach(function(ta){ta.readOnly=busy();});
    if(logoutBtn)logoutBtn.disabled=busy();
    if(speakBtn)speakBtn.disabled=busy() || !SpeechToText.hasTTS;
    if (sendToBotBtn) sendToBotBtn.disabled = busy() || !hasCur;
    var allDone = partHasContent(1) && partHasContent(2) && partHasContent(3);
    if (sendFullBtn) sendFullBtn.disabled = busy() || !allDone;
    if (subProgress) {
      var mk = function(p){ return (partHasContent(p) ? '✓' : '○') + ' Part ' + p; };
      subProgress.textContent = mk(1) + '   ' + mk(2) + '   ' + mk(3);
    }
  }
  function applyModeUI(){
    if (!sendToBotBtn || !sendFullBtn) return;
    var full = state.mode === 'full';
    if (full) {
      sendToBotBtn.style.display = 'none';
      sendFullBtn.style.display = '';
      if (subProgress) subProgress.style.display = '';
    } else {
      sendToBotBtn.style.display = '';
      sendFullBtn.style.display = 'none';
      if (subProgress) subProgress.style.display = 'none';
    }
    if(partPickerSection){
      partPickerSection.classList.toggle('is-collapsed', full);
      partPickerSection.setAttribute('aria-hidden', full ? 'true' : 'false');
    }
    updateQuestionNav();
  }
  if (subMode) {
    subMode.addEventListener('click', function(e){
      var b = e.target.closest('.submode-btn');
      if (!b || busy()) return;
      state.mode = b.dataset.mode;
      subMode.querySelectorAll('.submode-btn').forEach(function(x){ x.classList.toggle('active', x===b); });
      applyModeUI();
      updateSubmitButtons();
    });
  }

  function extractOverall(text){
    text=String(text||'');
    var final=text.match(/Overall Speaking[^\d\n]*(\d(?:\.\d)?)/i);
    if(final)return Number(final[1]);
    var matches=Array.from(text.matchAll(/Overall[^\d\n]*(\d(?:\.\d)?)/gi));
    return matches.length?Number(matches[matches.length-1][1]):null;
  }
  function saveGrading(modeVal,partVal,report,submission){
    savePracticeSnapshot(report,modeVal,partVal,submission);
    if(typeof BRAuth==='undefined'||!CURRENT_USER||CURRENT_USER.uid!==submission.userId){loadAndRenderHistory();return;}
    BRAuth.saveGrading({mode:modeVal,part:partVal,topic:submission.topic,overall:extractOverall(report),backend:AIExaminer.activeBackend(),report:report}).then(loadAndRenderHistory).catch(console.error);
  }
  function loadAndRenderHistory(){
    if (typeof BRAuth === 'undefined' || !CURRENT_USER) { renderHistory([]); return; }
    BRAuth.loadHistory().then(renderHistory).catch(function(e){ console.error(e); renderHistory([]); });
  }
  function renderHistory(list){
    if (!historyPanel || !historyBody) return;
    historyPanel.style.display = '';
    var local=readPracticeHistory();
    var html='';
    if(local.length){
      html+='<div class="history-section-title">Lịch sử luyện tập trên thiết bị · có transcript/audio</div>';
      html+=local.map(function(h){
        var when=new Date(h.createdAt||Date.now()).toLocaleString('vi-VN');
        var ansHtml=''; [1,2,3].forEach(function(p){(h.answers&&h.answers[p]||[]).forEach(function(a){ansHtml+='<div class="hist-answer"><b>Part '+p+' · '+escapeHtml(a.question||'')+'</b><p>'+escapeHtml(a.text||'')+'</p>'+(a.audioTransient?'<div class="review-note">Audio chỉ giữ trong phiên này; tải lại trang sẽ mất audio.</div>':'')+
        (a.audioId?'<audio controls preload="metadata" class="answer-audio" data-audio-id="'+escapeHtml(a.audioId)+'"></audio>':'')+'</div>';});});
        var ov=extractOverall(h.report);return '<details class="hist-item"><summary><span class="hist-band">'+(ov!=null?'Overall '+Number(ov).toFixed(1):'Practice')+'</span> <b>'+escapeHtml(h.mode==='full'?'Cả bài':'Part '+h.part)+'</b> · '+escapeHtml(h.topic||'')+' <span class="hist-when">'+escapeHtml(when)+'</span></summary><div class="hist-report">'+ansHtml+(h.report?AIExaminer.formatMarkdown(h.report):'')+'</div></details>';
      }).join('');
    }
    if(list&&list.length){
      html+='<div class="history-section-title">Bản chấm đã lưu theo tài khoản</div>';
      html+=list.map(function(h){var d=new Date(h.createdAt||Date.now()),when=d.toLocaleString('vi-VN'),label=(h.mode==='full')?'Cả bài (3 Part)':'Part '+h.part,ov=(h.overall!=null)?('Overall '+Number(h.overall).toFixed(1)):'—';return '<details class="hist-item"><summary><span class="hist-band">'+escapeHtml(ov)+'</span> <b>'+escapeHtml(label)+'</b> · '+escapeHtml(h.topic||'')+' <span class="hist-when">'+escapeHtml(when)+'</span></summary><div class="hist-report">'+AIExaminer.formatMarkdown(h.report||'')+'</div></details>';}).join('');
    }
    if(!html)html='<p class="hist-empty">Chưa có bài nào. Ghi âm và chấm một câu hoặc một Part để bắt đầu lưu lịch sử.</p>';
    historyBody.innerHTML=html;hydrateAudioElements(historyBody);
  }

  applyModeUI();

  // ============ TEXT-TO-SPEECH (ĐỌC CÂU HỎI) ============
  function speakableQuestionText(){
    if(state.part===2){
      var p2 = state.topic.part2;
      var bullets = (p2.bullets||[]).map(function(b){ return 'You should say ' + b + '.'; }).join(' ');
      return p2.title + '. ' + bullets;
    }
    return currentQuestionText();
  }

  function stopSpeaking(){
    SpeechToText.stopSpeaking();
    if(speakBtn){
      speakBtn.classList.remove('speaking');
      var lbl = speakBtn.querySelector('span');
      if(lbl) lbl.textContent = 'Nghe câu hỏi';
    }
  }

  function speakCurrentQuestion(){
    if(!speakBtn || busy()) return;
    if(!SpeechToText.hasTTS){
      statusEl.textContent = 'Trình duyệt này không hỗ trợ đọc văn bản thành giọng nói.';
      statusEl.className = 'status warn';
      return;
    }
    // Đang đọc -> bấm lần nữa để dừng (toggle)
    if(speakBtn.classList.contains('speaking')){ stopSpeaking(); return; }
    var lbl = speakBtn.querySelector('span');
    SpeechToText.speak(speakableQuestionText(), {
      lang: 'en-US',
      rate: 0.96,
      onStart: function(){ speakBtn.classList.add('speaking'); if(lbl) lbl.textContent = 'Dừng đọc'; },
      onEnd: function(){ speakBtn.classList.remove('speaking'); if(lbl) lbl.textContent = 'Nghe câu hỏi'; },
      onError: function(){
        speakBtn.classList.remove('speaking'); if(lbl) lbl.textContent = 'Nghe câu hỏi';
        statusEl.textContent = 'Không đọc được câu hỏi. Thử bấm lại hoặc kiểm tra âm thanh trình duyệt.';
        statusEl.className = 'status err';
      }
    });
  }

  if(speakBtn){
    if(!SpeechToText.hasTTS){ speakBtn.disabled = true; speakBtn.title = 'Trình duyệt không hỗ trợ đọc văn bản'; }
    speakBtn.addEventListener('click', speakCurrentQuestion);
  }

  // ============ QUESTION FLOW ============
  function questionsForPart(part){
    if(part===1) return state.topic.part1;
    if(part===3) return state.topic.part3;
    return [state.topic.part2];
  }

  function currentQuestionText(){
    var qs = questionsForPart(state.part);
    return state.part===2 ? state.topic.part2.title : qs[state.qIndex];
  }

  function updateQuestionNav(){
    if(!nextBtn) return;
    var qs = questionsForPart(state.part);
    var isLast = state.part===2 ? true : state.qIndex >= qs.length-1;
    var list = state.answersByPart[state.part] || [];
    var hasCurrent = !!(list[state.qIndex] && (list[state.qIndex].text||'').trim());
    var canMovePart = state.mode === 'full' && isLast && state.part < 3;
    if(canMovePart){
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Sang Part ' + (state.part+1) + ' →';
      nextBtn.disabled = busy() || !hasCurrent;
    } else if(state.part!==2 && !isLast){
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Câu tiếp theo →';
      nextBtn.disabled = busy() || !hasCurrent;
    } else {
      nextBtn.style.display = 'none';
      nextBtn.textContent = 'Câu tiếp theo →';
      nextBtn.disabled = true;
    }
  }

  function renderQuestion(){
    resetBooth();
    var qs = questionsForPart(state.part);
    var q = qs[state.qIndex];
    if(state.part===2){
      qIndexEl.textContent = 'Part 2 · Cue Card';
      qTextEl.textContent = q.title;
      qBulletsEl.hidden = false;
      qBulletsEl.innerHTML = q.bullets.map(function(b){ return '<li>You should say '+ escapeHtml(b) + '</li>';  }).join('');
      statusEl.textContent = 'Nhấn micro: 1 phút chuẩn bị (không ghi âm), sau đó tự động ghi 2 phút';
    } else {
      qIndexEl.textContent = 'Part ' + state.part + ' (Q' + (state.qIndex+1) + '/' + qs.length + ')';
      qTextEl.textContent = q;
      qBulletsEl.hidden = true;
      statusEl.textContent = 'Nhấn micro để bắt đầu trả lời';
    }
    statusEl.className = 'status';
    var list = state.answersByPart[state.part] || [];
    updateQuestionNav();
    redoBtn.disabled = !list.length;
    updateSubmitButtons();
    renderQuestionAssist();
  }

  function resetBooth(){
    state.interimText = "";
    updateLivePreview();
    timerEl.textContent = '00:00';
    micBtn.disabled = false;
    micBtn.classList.remove('recording','prepping','processing');
    SpeechToText.stopSpeaking();
    if(speakBtn) speakBtn.classList.remove('speaking');
  }

  function fmtTime(s){
    var m = Math.floor(s/60).toString().padStart(2,'0');
    var sec = Math.floor(Math.max(s,0)%60).toString().padStart(2,'0');
    return m+':'+sec;
  }

  function setOnAir(mode){
    // mode: 'off' | 'live' | 'processing'
    onairEl.classList.remove('live','processing');
    if(mode==='live'){ onairEl.textContent='ON AIR'; onairEl.classList.add('live'); brandDot.classList.remove('idle'); }
    else if(mode==='processing'){ onairEl.textContent='ĐANG XỬ LÝ'; onairEl.classList.add('processing'); brandDot.classList.remove('idle'); }
    else { onairEl.textContent='OFF AIR'; brandDot.classList.add('idle'); }
    if(mobileMicBtn){mobileMicBtn.classList.toggle('recording',mode==='live'); if(mobileMicLabel)mobileMicLabel.textContent=mode==='live'?'Dừng':'Nói';}
  }

  function updateLivePreview(){
    if(!state.interimText){
      livePreview.classList.remove('show');
      livePreview.innerHTML = '<span class="placeholder">Chữ nháp thời gian thực (chưa chính thức) sẽ hiện ở đây…</span>';
      return;
    }
    livePreview.classList.add('show');
    livePreview.innerHTML = escapeHtml(state.interimText);
    livePreview.scrollTop = livePreview.scrollHeight;
  }

  // ============ WAVEFORM ============
  function drawWave(data){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth = 2;
    var grad = ctx.createLinearGradient(0,0,canvas.width,0);
    grad.addColorStop(0,'#4FD1C5');
    grad.addColorStop(1,'#E8B355');
    ctx.strokeStyle = grad;
    ctx.beginPath();
    var slice = canvas.width / data.length;
    var x = 0;
    for(var i=0;i<data.length;i++){
      var v = data[i]/128.0;
      var y = (v * canvas.height)/2;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      x += slice;
    }
    ctx.stroke();
  }
  function drawIdleWave(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(138,147,168,0.3)';
    ctx.moveTo(0,canvas.height/2);
    ctx.lineTo(canvas.width,canvas.height/2);
    ctx.stroke();
  }
  drawIdleWave();

  // ============ TIMER ============
  function startCountdown(seconds, onDone){
    state.remaining = seconds;
    timerEl.textContent = fmtTime(state.remaining);
    state.timerId = setInterval(function(){
      state.remaining -= 1;
      timerEl.textContent = fmtTime(state.remaining);
      if(state.remaining<=0){
        clearInterval(state.timerId);
        state.timerId = null;
        onDone && onDone();
      }
    },1000);
  }
  function stopCountdown(){
    if(state.timerId){ clearInterval(state.timerId); state.timerId = null; }
  }

  // ============ RECORDING (điều phối gọi SpeechToText.start / stop) ============
  function beginPrep(){
    if(busy())return;
    state.prepping = true;updateSubmitButtons();updateQuestionNav();
    micBtn.classList.add('prepping');
    statusEl.textContent = 'Đang chuẩn bị… ghi chú trong đầu, chưa ghi âm';
    startCountdown(PREP_SECONDS, function(){
      state.prepping = false;
      micBtn.classList.remove('prepping');
      beginRecording();
    });
  }

  function beginRecording(){
    if(busy())return;
    state.starting=true;
    var recording={part:state.part,index:state.qIndex,question:currentQuestionText()};
    state.recording=recording;
    micBtn.disabled=true;updateSubmitButtons();updateQuestionNav();
    SpeechToText.stopSpeaking();
    if(speakBtn) speakBtn.classList.remove('speaking');
    SpeechToText.start({
      lang: 'en-US',
      onInterim: function(text){
        state.interimText = text;
        updateLivePreview();
      },
      onAudioData: function(data){
        drawWave(data);
      },
      onMicError: function(err){
        statusEl.textContent = 'Không thể truy cập micro. Vui lòng cấp quyền micro cho trang này.';
        statusEl.className = 'status err';
        console.error(err);
      }
    }).then(function(){
      state.starting=false;state.recStart=Date.now();micBtn.disabled=false;
      state.recognizing = true;updateSubmitButtons();updateQuestionNav();
      micBtn.classList.add('recording');
      setOnAir('live');
      statusEl.textContent = 'Đang ghi âm… nhấn micro để dừng sớm';
      statusEl.className = 'status';
      var maxS = MAX_SECONDS[state.part];
      startCountdown(maxS, function(){ stopRecording(); });
    }).catch(function(){ state.starting=false;micBtn.disabled=false;updateSubmitButtons();updateQuestionNav(); });
  }

  function stopRecording(){
    if(state.processing || !state.recognizing) return;
    var recording=state.recording;
    var elapsed=state.recStart?Math.max(0,Math.round((Date.now()-state.recStart)/1000)):0;
    stopCountdown();
    state.recognizing = false;
    state.processing = true;
    micBtn.classList.remove('recording');
    micBtn.classList.add('processing');
    micBtn.disabled = true;
    setOnAir('processing');
    statusEl.textContent = 'Đang hoàn tất ghi âm và transcript trình duyệt…';
    statusEl.className = 'status warn';

    var speechPromise = SpeechToText.stop();
    speechPromise.then(function(result){
      var rawAudioBlob = SpeechToText.takeLastAudioBlob();
      drawIdleWave();
      setOnAir('off');
      micBtn.classList.remove('processing');
      state.processing = false;

      var finalText = result.text || "";
      var srcLabel='trình duyệt';
      statusEl.textContent=finalText?'Đã ghi âm. Soát transcript rồi gửi Gemini chấm.':'Đã giữ audio. Bạn có thể nhập transcript hoặc gửi audio cho Gemini.';
      statusEl.className='status';
      var answerObj={part:recording.part,question:recording.question,text:finalText.trim(),seconds:elapsed,source:srcLabel,audioId:'',review:null};
      state.answersByPart[recording.part][recording.index]=answerObj;
      // Giữ khóa thao tác đến khi audio đã được lưu, để bài chấm luôn có audio.
      state.processing=true;
      var stored=rawAudioBlob&&rawAudioBlob.size?storeAudioBlob(rawAudioBlob):Promise.resolve('');
      stored.then(function(id){answerObj.audioId=id;}).catch(function(err){answerObj.audioId=err.audioId||'';answerObj.audioTransient=!!err.audioId;statusEl.className='status warn';statusEl.textContent=err.message;}).finally(function(){state.processing=false;micBtn.disabled=false;renderAnswerList();updateSubmitButtons();updateQuestionNav();});
      renderAnswerList();

      var qs = questionsForPart(state.part);
      updateQuestionNav();
      redoBtn.disabled = false;
      updateSubmitButtons();
    }).catch(function(err){
      state.processing=false;micBtn.classList.remove('processing');micBtn.disabled=false;
      setOnAir('off');drawIdleWave();
      statusEl.className='status err';statusEl.textContent='Không xử lý được audio: '+(err&&err.message||'lỗi không rõ');
    });
  }

  function renderAnswerList(){
    var list = state.answersByPart[state.part] || [];
    answerListEl.innerHTML = list.map(function(a, idx){
      a = a || { text:'', question:'', seconds:0, source:'' };
      var txt = (a.text||'');
      var words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
      var wpm = a.seconds ? ' · ~'+Math.round(words/(a.seconds/60))+' từ/phút' : '';
      var secs = a.seconds ? ' · '+a.seconds+'s' : '';
      return '<div class="answer-card" data-answer="'+idx+'">' +
        '<div class="a-q">'+escapeHtml(a.question||'')+'</div>' +
        '<textarea data-idx="'+idx+'" placeholder="Nhập hoặc chỉnh transcript ở đây…">'+escapeHtml(txt)+'</textarea>' +
        '<div class="a-meta"><span>'+words+' từ'+secs+wpm+'</span><span>nguồn: '+escapeHtml(a.source||'—')+'</span></div>' +
        (a.audioTransient?'<div class="review-note">Audio chỉ giữ trong phiên này; tải lại trang sẽ mất audio.</div>':'')+
        (a.audioId?'<audio controls preload="metadata" class="answer-audio" data-audio-id="'+escapeHtml(a.audioId)+'"></audio>':'')+
        '<div class="answer-actions"><button class="mini-btn listen-answer" data-idx="'+idx+'" type="button">🔊 Nghe câu</button><button class="mini-btn review-answer" data-idx="'+idx+'" type="button">✦ Chấm câu này</button></div>'+
        '</div>';
    }).join('');
    answerListEl.querySelectorAll('textarea').forEach(function(ta){
      ta.addEventListener('input', function(e){
        var idx = Number(e.target.dataset.idx);
        if(busy())return;
        if (state.answersByPart[state.part][idx]) {state.answersByPart[state.part][idx].text = e.target.value;state.answersByPart[state.part][idx].review=null;clearReview();}
        var words = e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0;
        e.target.closest('.answer-card').querySelector('.a-meta span').textContent = words + ' từ';
        updateSubmitButtons();
        updateQuestionNav();
      });
    });
    answerListEl.querySelectorAll('.listen-answer').forEach(function(b){b.addEventListener('click',function(){var a=list[Number(b.dataset.idx)];if(!busy()&&a&&a.text)SpeechToText.speak(a.text,{lang:'en-US',rate:.92});});});
    answerListEl.querySelectorAll('.review-answer').forEach(function(b){b.addEventListener('click',function(){
      var idx=Number(b.dataset.idx), a=list[idx]; if(!a||(!a.text&&!a.audioId)||busy())return;
      var submission=snapshot(), part=submission.part;
      state.reviewBusy=true;updateSubmitButtons();updateQuestionNav();b.disabled=true;b.textContent='Đang chấm…';reviewPanel.classList.add('show');reviewPanel.innerHTML='<div class="review-note">✦ Đang phân tích câu trả lời…</div>';
      loadAudioBlob(a.audioId).then(function(blob){return AIExaminer.reviewAnswer(part,a.question,a.text,blob,a.seconds);}).then(function(r){
        a.review=r;if(r.transcript)a.text=r.transcript;submission.answers[part][idx]=JSON.parse(JSON.stringify(a));renderReview(r,a);
        var c=r.criteria||{};
        var mini='### Đánh giá câu trả lời\n**Overall (ước tính): '+band(r.overall)+'**\n- Fluency & Coherence: '+band(c.fluency_coherence)+'\n- Lexical Resource: '+band(c.lexical_resource)+'\n- Grammar: '+band(c.grammatical_range_accuracy)+'\n- Pronunciation: '+band(c.pronunciation)+'\n\n'+(r.summary_vi||'')+'\n\n**Gợi ý sửa:** '+(r.corrected_answer||'Chưa có đánh giá AI');
        savePracticeSnapshot(mini,'question',part,submission); loadAndRenderHistory();
      }).catch(function(e){reviewPanel.innerHTML='<div class="review-note">Không chấm được câu này: '+escapeHtml(e&&e.message?e.message:String(e))+'</div>';}).finally(function(){state.reviewBusy=false;b.disabled=false;b.textContent='✦ Chấm câu này';renderAnswerList();updateSubmitButtons();updateQuestionNav();});
    });});
    hydrateAudioElements(answerListEl);
  }

  micBtn.addEventListener('click', function(){
    if(micBtn.disabled || state.starting || state.prepping || state.processing || state.reviewBusy || state.gradingBusy) return;
    if(state.recognizing){ stopRecording(); return; }
    if(state.part===2){ beginPrep(); return; }
    beginRecording();
  });


  if(mobileMicBtn) mobileMicBtn.addEventListener('click',function(){micBtn.click();});
  if(keyboardBtn) keyboardBtn.addEventListener('click',function(){
    if(busy())return;
    var list=state.answersByPart[state.part]||[], idx=state.qIndex, a=list[idx];
    if(!a){a={part:state.part,question:currentQuestionText(),text:'',seconds:0,source:'bàn phím',audioId:'',review:null};state.answersByPart[state.part][idx]=a;renderAnswerList();}
    updateQuestionNav();
    var ta=answerListEl.querySelector('textarea[data-idx="'+idx+'"]');if(ta){ta.classList.add('keyboard-focus');ta.focus();setTimeout(function(){ta.classList.remove('keyboard-focus')},900);ta.scrollIntoView({behavior:'smooth',block:'center'});}updateSubmitButtons();
  });
  if(newSessionBtn) newSessionBtn.addEventListener('click',function(){
    closeSideMenu();
    if(busy()){statusEl.textContent='Hãy dừng ghi âm và chờ xử lý xong trước khi bắt đầu bài mới.';return;}
    if(state.prepping){state.prepping=false;micBtn.classList.remove('prepping');}
    stopCountdown();
    var pool=TOPICS.filter(function(t){return t!==state.topic});state.topic=pool[Math.floor(Math.random()*pool.length)]||TOPICS[0];if(topicSelect)topicSelect.value=String(TOPICS.indexOf(state.topic));try{localStorage.setItem('band_room_selected_topic',state.topic.name);}catch(e){}
    state.part=1;state.qIndex=0;state.answersByPart={1:[],2:[],3:[]};state.chat=[];state.interimText='';updateLivePreview();topicPill.textContent=state.topic.name;
    document.querySelectorAll('.part-btn').forEach(function(b){b.classList.toggle('active',Number(b.dataset.part)===1);});
    renderAnswerList();if(reviewPanel){reviewPanel.classList.remove('show');reviewPanel.innerHTML='';}renderQuestion();updateSubmitButtons();
    if(mobilePartLabel)mobilePartLabel.textContent='Part 1 · Speaking';
    addChatMessage('assistant','Bắt đầu bài mới · **'+state.topic.name+'**. Làm lần lượt Part 1 → Part 2 → Part 3, hoặc chấm từng Part khi bạn muốn.');
    document.querySelector('.app').classList.add('new-session-flash');setTimeout(function(){document.querySelector('.app').classList.remove('new-session-flash')},500);
  });

  nextBtn.addEventListener('click', function(){
    if(busy() || nextBtn.disabled)return;
    var qs = questionsForPart(state.part);
    var isLast = state.part===2 ? true : state.qIndex >= qs.length-1;
    if(state.mode==='full' && isLast && state.part<3){
      switchPart(state.part+1);
      return;
    }
    state.qIndex += 1;
    renderQuestion();
  });

  redoBtn.addEventListener('click', function(){
    if(busy())return;clearReview();
    state.answersByPart[state.part] = [];
    renderAnswerList();
    state.qIndex = 0;
    renderQuestion();
    updateSubmitButtons();
  });

  function switchPart(part){
    if(busy()){statusEl.textContent='Hãy dừng ghi âm và chờ phiên âm xong trước khi chuyển Part.';return;}
    if(state.prepping){state.prepping=false;micBtn.classList.remove('prepping');}
    stopCountdown();
    clearReview();
    state.part = part;
    if(practicePanel) practicePanel.classList.add('content-swap');
    var list = state.answersByPart[part] || [];
    var qlen = questionsForPart(part).length;
    state.qIndex = Math.min(list.length, qlen-1);
    renderAnswerList();
    document.querySelectorAll('.part-btn').forEach(function(b){
      b.classList.toggle('active', Number(b.dataset.part)===part);
    });
    if(mobilePartLabel) mobilePartLabel.textContent='Part '+part+' · Speaking';
    renderQuestion();
    updateSubmitButtons();
    closeSideMenu();
    window.setTimeout(function(){ if(practicePanel) practicePanel.classList.remove('content-swap'); },180);
  }

  partNav.addEventListener('click', function(e){
    var btn = e.target.closest('.part-btn');
    if(!btn) return;
    switchPart(Number(btn.dataset.part));
  });

  // ============ CHATBOT (điều phối gọi AIExaminer) ============
  function addChatMessage(role, content, isError){
    state.chat.push({role:role, content:content, isError: !!isError});
    renderChat();
  }

  function renderChat(){
    chatScroll.innerHTML = state.chat.map(function(m){
      var isUser = m.role==='user';
      var cls = isUser ? 'user' : (m.isError ? 'bot error' : 'bot');
      return '<div class="msg '+cls+'">' +
        '<div class="avatar '+(isUser?'user':'bot')+'">'+(isUser?'BẠN':'AI')+'</div>' +
        '<div class="bubble">'+ AIExaminer.formatMarkdown(m.content) +'</div>' +
        '</div>';
    }).join('');
    chatScroll.scrollTop = chatScroll.scrollHeight;
  }

  function showTyping(){
    var div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typingMsg';
    div.innerHTML = '<div class="avatar bot">AI</div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
    chatScroll.appendChild(div);
    chatScroll.scrollTop = chatScroll.scrollHeight;
  }
  function hideTyping(){
    var t = el('typingMsg');
    if(t) t.remove();
  }

  function callExaminer(){
    state.gradingBusy=true;updateSubmitButtons();updateQuestionNav();showTyping();chatSendBtn.disabled=true;
    var history=state.chat.filter(function(m){return !m.isError;}).map(function(m){return {role:m.role,content:m.content};});
    history=history.slice(-20);
    while(history.length && history[0].role!=='user')history.shift();
    return AIExaminer.chat(history).then(function(text){addChatMessage('assistant',text);}).catch(function(err){addChatMessage('assistant','Không gọi được Gemini: '+err.message,true);}).finally(function(){hideTyping();state.gradingBusy=false;chatSendBtn.disabled=false;updateSubmitButtons();updateQuestionNav();});
  }

  function renderQuickChips(){
    quickChips.innerHTML = AIExaminer.SUGGESTED_PROMPTS.map(function(c){ return '<span class="chip">'+c+'</span>'; }).join('');
    quickChips.querySelectorAll('.chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        chatInput.value = chip.textContent;
        sendChat();
      });
    });
  }

  function sendChat(){
    var text = chatInput.value.trim();
    if(!text || busy()) return;
    addChatMessage('user', text);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    callExaminer();
  }

  chatSendBtn.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', function(e){
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendChat(); }
  });
  chatInput.addEventListener('input', function(){
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight,90) + 'px';
  });

  // Chốt một bản dữ liệu độc lập trước mọi I/O; khóa thao tác tới khi lưu xong.
  function submitGrading(mode){
    if(busy())return;
    if(mode==='full' && !(partHasContent(1)&&partHasContent(2)&&partHasContent(3)))return;
    var submission=snapshot(), part=submission.part;
    if(mode==='part'&&!partHasContent(part))return;
    state.gradingBusy=true;updateSubmitButtons();updateQuestionNav();chatSendBtn.disabled=true;
    var selected=mode==='full'?[1,2,3]:[part];
    var pending=[];
    selected.forEach(function(p){submission.answers[p].filter(Boolean).forEach(function(a){
      pending.push(loadAudioBlob(a.audioId).then(function(blob){a.audioBlob=blob;}));
    });});
    addChatMessage('user',mode==='full'?'Chấm cả bài: '+submission.topic:'Chấm Part '+part+': '+submission.topic);showTyping();
    Promise.all(pending).then(function(){return AIExaminer.gradeAnswers(submission.answers,mode,part);}).then(function(report){
      // Blobs chỉ dùng trong yêu cầu API, không ghi vào JSON lịch sử.
      selected.forEach(function(p){submission.answers[p].filter(Boolean).forEach(function(a){delete a.audioBlob;});});
      addChatMessage('assistant',report);saveGrading(mode,mode==='full'?'all':part,report,submission);
    }).catch(function(err){addChatMessage('assistant','Không chấm được bài: '+err.message+'. Dữ liệu luyện tập vẫn được giữ; bạn có thể thử lại.',true);}).finally(function(){
      hideTyping();state.gradingBusy=false;chatSendBtn.disabled=false;updateSubmitButtons();updateQuestionNav();
    });
  }
  sendToBotBtn.addEventListener('click',function(){submitGrading('part');});
  sendFullBtn.addEventListener('click',function(){submitGrading('full');});

  // Greeting
  addChatMessage('assistant', 'Chào bạn! Mình là **Giám khảo AI** của Band Room, chấm theo **4 tiêu chí IELTS** (thang **0–9.0**): Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.\n\n**Cách dùng:**\n- Ghi âm câu trả lời ở Studio bên trái (bấm **Nghe câu hỏi** để nghe đọc). Chuyển giọng nói thành văn bản chạy **miễn phí trong trình duyệt** — nhớ soát lại ô văn bản để sửa từ bị nghe nhầm (ví dụ what/was) trước khi gửi.\n- Chọn **Cách nộp bài**: *Chấm từng Part* hoặc *Làm cả 3 Part rồi chấm*.\n- Sau khi chấm, mình sẽ cho **nhận xét tổng quan, điểm từng tiêu chí, sửa lỗi (nhất là ngữ pháp) và gợi ý từ/cụm/câu** hay hơn.\n\nChấm điểm dùng **Gemini trực tiếp**. Khi chưa cấu hình Gemini, bạn vẫn luyện tập và lưu audio; hệ thống không tự tạo điểm IELTS. Đánh giá Pronunciation chỉ đáng tin khi có âm thanh và model hỗ trợ nghe, không thể kết luận chính xác chỉ từ transcript. Bài chấm được **lưu vào lịch sử** theo tài khoản của bạn.');
  renderQuickChips();

  renderQuestion();
  loadAndRenderHistory();
  // Đánh dấu khi giao diện đã được khởi tạo xong cho bộ kiểm tra tải trang.
  window.BandRoomReady = true;
})();
