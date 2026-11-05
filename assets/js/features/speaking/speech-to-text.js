
(function (global) {
  "use strict";

  var SR = global.SpeechRecognition || global.webkitSpeechRecognition;

  function pickMimeType() {
    if (!global.MediaRecorder || typeof global.MediaRecorder.isTypeSupported !== "function") return "";
    var candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
      "audio/mp4",
      "audio/mpeg"
    ];
    for (var i = 0; i < candidates.length; i++) {
      try { if (global.MediaRecorder.isTypeSupported(candidates[i])) return candidates[i]; } catch (e) { /* ignore */ }
    }
    return "";
  }

  /* Không viết lại ngữ pháp hay bỏ từ lặp: bài IELTS cần transcript trung thực. */
  function cleanTranscript(raw) {
    // Không xoá filler, từ lặp hay tự sửa ngữ pháp: đó là dữ liệu để chấm Speaking.
    return String(raw || '').replace(/\s+/g,' ').trim();
  }

  var SpeechToText = {
    hasLiveInterim: !!SR,
    hasRecording: !!(global.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    hasTTS: !!(global.speechSynthesis && global.SpeechSynthesisUtterance),

    // ---- trạng thái nội bộ ----
    _stream: null,
    _audioCtx: null,
    _analyser: null,
    _rafId: null,
    _active: false,
    _starting: false,
    _recognitionDone: null,
    _recognition: null,
    _mediaRecorder: null,
    _chunks: [],
    _mime: "",
    _finalTranscript: "",   // phần đã chốt, tích luỹ QUA các lần restart -> liền mạch
    _interim: "",           // phần đang nói (chưa chốt) của phiên hiện tại
    _manualStop: false,     // true khi người dùng chủ động dừng (không tự restart nữa)
    _restartTimer: null,
    _voices: [],
    _lastAudioBlob: null,
    takeLastAudioBlob: function(){ var blob=this._lastAudioBlob; this._lastAudioBlob=null; return blob; },

    /**
     * Bắt đầu ghi âm + nhận dạng thời gian thực.
     * options = { lang, liveInterim, onInterim, onAudioData, onMicError }
     * @returns {Promise<boolean>}
     */
    start: function (options) {
      var self = this;
      options = options || {};
      if (self._active || self._starting) return Promise.reject(new Error("Đang có một phiên ghi âm."));
      self._starting = true;

      self._chunks = [];
      self._lastAudioBlob = null;
      self._finalTranscript = "";
      self._interim = "";
      self._manualStop = false;

      if (!self.hasRecording) {
        var err = new Error("Trình duyệt không hỗ trợ ghi âm (MediaRecorder).");
        if (options.onMicError) options.onMicError(err);
        self._starting = false;
        return Promise.reject(err);
      }

      var constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      return navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        self._starting = false;
        self._stream = stream;
        self._active = true;

        // ---- (A) Waveform: phân tích sóng âm để UI vẽ ----
        try {
          var AudioContextImpl = global.AudioContext || global.webkitAudioContext;
          if (AudioContextImpl) {
            self._audioCtx = new AudioContextImpl();
            var source = self._audioCtx.createMediaStreamSource(stream);
            self._analyser = self._audioCtx.createAnalyser();
            self._analyser.fftSize = 1024;
            self._analyser.smoothingTimeConstant = 0.78; // mượt hơn, đỡ giật
            source.connect(self._analyser);
            var waveData = new Uint8Array(self._analyser.frequencyBinCount);
            (function loop() {
              if (!self._active) return;
              self._rafId = requestAnimationFrame(loop);
              self._analyser.getByteTimeDomainData(waveData);
              if (options.onAudioData) options.onAudioData(waveData);
            })();
          }
        } catch (e) { /* waveform không bắt buộc, bỏ qua nếu lỗi */ }

        // ---- (B) Nhận dạng thời gian thực (mượt, không mất chữ) ----
        if (self.hasLiveInterim && options.liveInterim !== false) {
          self._startRecognition(options);
        }

        // ---- (C) Giữ audio để Gemini đánh giá ----
        self._mime = pickMimeType();
        try {
          self._mediaRecorder = self._mime
            ? new MediaRecorder(stream, { mimeType: self._mime })
            : new MediaRecorder(stream);
        } catch (e) {
          try { self._mediaRecorder = new MediaRecorder(stream); self._mime = ""; }
          catch (e2) { self._mediaRecorder = null; }
        }
        if (self._mediaRecorder) {
          self._mediaRecorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) self._chunks.push(e.data);
          };
          // gom dữ liệu mỗi 1s để giảm nguy cơ mất chunk cuối trên vài trình duyệt
          try { self._mediaRecorder.start(1000); } catch (e) { self._mediaRecorder.start(); }
        } else throw new Error('Không khởi tạo được bộ ghi âm.');

        return true;
      }).catch(function (err) {
        if (options.onMicError) options.onMicError(err);
        self._hardReset();
        throw err;
      });
    },

    // Tạo & cấu hình một phiên nhận dạng; tự khởi động lại liền mạch khi kết thúc.
    _startRecognition: function (options) {
      var self=this, rec, finalByIndex={}, interim='';
      try { rec=new SR(); }catch(e){return;}
      self._recognition=rec;
      rec.lang=options.lang||'en-US';
      rec.continuous=true;
      rec.interimResults=true;
      rec.maxAlternatives=1;
      rec.onresult=function(ev){
        // Đọc toàn bộ kết quả của phiên và cập nhật theo index — không nối lại
        // cùng một chunk nhiều lần khi trình duyệt gửi các sự kiện cập nhật.
        var currentInterim=[];
        for(var i=0;i<ev.results.length;i++){
          var res=ev.results[i], text=(res[0]&&res[0].transcript)||'';
          if(res.isFinal) finalByIndex[i]=text;
          else currentInterim.push(text);
        }
        interim=currentInterim.join(' ').trim();
        self._interim=Object.keys(finalByIndex).sort(function(a,b){return a-b;}).map(function(k){return finalByIndex[k];}).join(' ')+' '+interim;
        if(options.onInterim)options.onInterim(cleanTranscript(self._finalTranscript+' '+self._interim));
      };
      rec.onerror=function(ev){
        var code=ev && ev.error;
        if(code==='not-allowed'||code==='service-not-allowed'){
          self._manualStop=true;
          if(options.onMicError) options.onMicError(new Error('Micro hoặc dịch vụ nhận dạng bị chặn. Hãy kiểm tra quyền micro.'));
        }
        // Mạng/thiếu hỗ trợ của Web Speech không ảnh hưởng việc MediaRecorder ghi audio.
      };
      rec.onend=function(){
        if(self._recognitionDone) { self._recognitionDone(); self._recognitionDone = null; }
        if(!self._active || self._manualStop) return;
        var closed=Object.keys(finalByIndex).sort(function(a,b){return a-b;}).map(function(k){return finalByIndex[k];}).join(' ');
        self._finalTranscript=cleanTranscript(self._finalTranscript+' '+closed+' '+interim);
        self._interim='';
        if(self._restartTimer) clearTimeout(self._restartTimer);
        self._restartTimer=setTimeout(function(){
          if(self._active && !self._manualStop)self._startRecognition(options);
        },350);
      };
      try{rec.start();}catch(e){
        // Một số trình duyệt từ chối khởi động — audio vẫn ghi được để gửi Gemini.
      }
    },

    // Đợi kết quả cuối của SpeechRecognition trước khi chốt transcript.
    // Audio được giữ nguyên cho Gemini phân tích khi chấm.
    stop: function () {
      var self = this;
      self._active = false;
      self._manualStop = true;
      if (self._rafId) { cancelAnimationFrame(self._rafId); self._rafId = null; }
      if (self._restartTimer) { clearTimeout(self._restartTimer); self._restartTimer = null; }
      var recognitionFinished = new Promise(function(resolve) {
        var done = false, timer;
        function finish() { if(done)return; done=true; clearTimeout(timer); self._recognitionDone=null; resolve(); }
        if (!self._recognition) { finish(); return; }
        self._recognitionDone = finish;
        timer = setTimeout(finish, 1500);
        try { self._recognition.stop(); } catch(e) { finish(); }
      });
      var recordingFinished = new Promise(function(resolve) {
        var mr = self._mediaRecorder;
        function finish() {
          self._lastAudioBlob = self._chunks.length ? new Blob(self._chunks, {type:self._mime || 'audio/webm'}) : null;
          self._chunks = []; resolve();
        }
        if(mr && mr.state !== 'inactive') {
          mr.onstop = finish;
          try { mr.stop(); } catch(e) { finish(); }
        } else finish();
      });
      return Promise.all([recognitionFinished,recordingFinished]).then(function() {
        var text = cleanTranscript(self._finalTranscript + ' ' + self._interim);
        if(self._stream) self._stream.getTracks().forEach(function(t){t.stop();});
        if(self._audioCtx) { try { self._audioCtx.close().catch(function(){}); } catch(e){} }
        self._stream=null; self._audioCtx=null; self._analyser=null; self._recognition=null; self._mediaRecorder=null;
        return {text:text,source:text?'browser':'none',browserText:text};
      });
    },

    /* -------------------- (C) TEXT-TO-SPEECH -------------------- */
    _loadVoices: function () {
      try { this._voices = (global.speechSynthesis && speechSynthesis.getVoices()) || []; }
      catch (e) { this._voices = []; }
      return this._voices;
    },

    // Chọn giọng tiếng Anh tốt nhất có sẵn.
    _pickEnglishVoice: function () {
      var voices = this._loadVoices();
      if (!voices.length) return null;
      var order = [/en[-_]US/i, /en[-_]GB/i, /en[-_]AU/i, /^en/i];
      for (var k = 0; k < order.length; k++) {
        for (var i = 0; i < voices.length; i++) {
          if (order[k].test(voices[i].lang || "")) return voices[i];
        }
      }
      return null;
    },

    /**
     * Đọc văn bản thành giọng nói.
     * opts = { lang, rate, pitch, onStart, onEnd, onError }
     */
    speak: function (text, opts) {
      opts = opts || {};
      if (!this.hasTTS) { if (opts.onError) opts.onError(new Error("Trình duyệt không hỗ trợ đọc văn bản.")); return false; }
      try { speechSynthesis.cancel(); } catch (e) {}

      var u = new SpeechSynthesisUtterance(String(text || ""));
      u.lang = opts.lang || "en-US";
      u.rate = typeof opts.rate === "number" ? opts.rate : 0.95;
      u.pitch = typeof opts.pitch === "number" ? opts.pitch : 1;
      var voice = this._pickEnglishVoice();
      if (voice) u.voice = voice;
      if (opts.onStart) u.onstart = opts.onStart;
      if (opts.onEnd) u.onend = opts.onEnd;
      if (opts.onError) u.onerror = opts.onError;

      try { speechSynthesis.speak(u); return true; }
      catch (e) { if (opts.onError) opts.onError(e); return false; }
    },

    stopSpeaking: function () { try { speechSynthesis.cancel(); } catch (e) {} },

    /* -------------------- dọn dẹp cứng -------------------- */
    _hardReset: function () {
      this._active = false;
      this._starting = false;
      this._manualStop = true;
      if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
      if (this._restartTimer) { clearTimeout(this._restartTimer); this._restartTimer = null; }
      if (this._recognition) { try { this._recognition.stop(); } catch (e) {} }
      if (this._mediaRecorder && this._mediaRecorder.state !== "inactive") {
        try { this._mediaRecorder.stop(); } catch (e) {}
      }
      if (this._stream) { try { this._stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} }
      if (this._audioCtx) { try { this._audioCtx.close().catch(function () {}); } catch (e) {} }
      this._stream = null; this._audioCtx = null; this._analyser = null;
      this._recognition = null; this._mediaRecorder = null; this._chunks = [];
      this._finalTranscript = ""; this._interim = "";
    }
  };

  // Một số trình duyệt nạp danh sách giọng nói không đồng bộ.
  if (SpeechToText.hasTTS) {
    try {
      SpeechToText._loadVoices();
      if (typeof speechSynthesis.onvoiceschanged !== "undefined") {
        speechSynthesis.onvoiceschanged = function () { SpeechToText._loadVoices(); };
      }
    } catch (e) { /* ignore */ }
  }

  global.SpeechToText = SpeechToText;
})(window);
