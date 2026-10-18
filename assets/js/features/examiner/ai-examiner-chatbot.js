(function (global) {
  'use strict';

  var status = {configured:false,provider:'offline'};
  var client;
  var SUGGESTED_PROMPTS = ['Giải thích thêm về Lexical Resource','Làm sao tăng độ trôi chảy?','Cho ví dụ câu ghép/câu phức','Góp ý cách luyện phát âm'];
  function refreshStatus() {
    var config=global.env||{};
    var models=Array.isArray(config.GEMINI_MODELS)?config.GEMINI_MODELS:['gemini-2.5-flash-lite'];
    status={configured:!!config.GEMINI_KEY,provider:'gemini',model:models[0]};
    client=global.BandRoomGemini.create({apiKey:config.GEMINI_KEY||'',model:status.model,models:models,timeoutMs:35000});
    return Promise.resolve(status);
  }
  function isOnline(){return status.configured;}
  function activeBackend(){return isOnline()?'gemini':'offline';}
  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function formatMarkdown(text) {
    // Escape first; never inject provider HTML or permit Markdown URLs.
    var lines = escapeHtml(text).split(/\r?\n/), html = '', list = '';
    function closeList() { if (list) { html += '</' + list + '>'; list = ''; } }
    function inline(line) { return line.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
    lines.forEach(function (line) {
      var item = line.trim(), heading = item.match(/^#{1,3}\s+(.+)$/);
      if (!item) { closeList(); return; }
      if (heading) { closeList(); html += '<h3>' + inline(heading[1]) + '</h3>'; return; }
      var bullet = item.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
      if (bullet) {
        var type = /^\d/.test(item) ? 'ol' : 'ul';
        if (list !== type) { closeList(); html += '<' + type + '>'; list = type; }
        html += '<li>' + inline(bullet[1]) + '</li>';
      } else { closeList(); html += '<p>' + inline(item) + '</p>'; }
    });
    closeList(); return html || '<p></p>';
  }
  function normalize(text) { return String(text || '').replace(/\s+/g, ' ').trim(); }
  function wordsOf(text) { return normalize(text).match(/[a-z]+(?:'[a-z]+)?/gi) || []; }

  function buildGradingMessage(part, answers) {
    return 'Đánh giá bài luyện IELTS Speaking Part ' + part + '. Chỉ có transcript: không chấm Pronunciation hoặc Overall Speaking.\n\n' +
      (answers || []).map(function (answer, index) {
        return 'Question ' + (index + 1) + ': ' + answer.question + '\nAnswer: ' + (answer.text || '(chưa trả lời)');
      }).join('\n\n');
  }
  function buildGradingMessageFull(answersByPart) {
    return [1, 2, 3].map(function (part) { return buildGradingMessage(part, (answersByPart || {})[part]); }).join('\n\n');
  }

  function reviewLocal(part, question, transcript) {
    var count = wordsOf(transcript).length;
    var feedback = count < 10 ? ['Nội dung còn ngắn; hãy trả lời trực tiếp rồi thêm lý do hoặc ví dụ.'] :
      ['Transcript có ' + count + ' từ. Kiểm tra xem ý chính, lý do và ví dụ đã liên kết rõ ràng chưa.'];
    if (Number(part) === 2) feedback.push('Luyện nói liên tục 1–2 phút và bao quát các ý của cue card.');
    if (Number(part) === 3) feedback.push('Nêu quan điểm, giải thích và đưa ví dụ hoặc đối chiếu để phát triển lập luận.');
    return {
      overall: null,
      criteria: { fluency_coherence: null, lexical_resource: null, grammatical_range_accuracy: null, pronunciation: null },
      corrected_answer: '', natural_answer: '', transcript: normalize(transcript),
      summary_vi: count ? 'Gợi ý luyện tập cục bộ; chưa có đánh giá ngữ pháp hoặc điểm IELTS.' : 'Chưa có transcript để nhận xét.',
      feedback_vi: feedback,
      pronunciation_notes_vi: ['Chưa phân tích audio; không thể đánh giá phát âm.'],
      word_feedback: [], used_audio: false
    };
  }
  function gradeLocal(part, answers) {
    var text = (answers || []).map(function (answer) { return answer.text || ''; }).join(' ');
    var review = reviewLocal(part, '', text);
    return '### Part ' + part + ' — Luyện tập cục bộ\n' + review.summary_vi + '\n' +
      review.feedback_vi.map(function (tip) { return '- ' + tip; }).join('\n') +
      '\n**Pronunciation:** chưa đánh giá.\n**Overall:** chưa đánh giá; cần AI và audio để chấm đủ bốn tiêu chí.';
  }
  function gradeLocalFull(answersByPart) {
    return [1, 2, 3].map(function (part) { return gradeLocal(part, (answersByPart || {})[part]); }).join('\n\n');
  }
  function replyLocal(text) {
    var query = String(text || '').toLowerCase();
    if (/pronun|phát âm|intonation/.test(query)) return '### Luyện phát âm\n- Ghi âm và nghe lại âm cuối, trọng âm và ngữ điệu.\n- So sánh với audio mẫu; không thể chấm phát âm chỉ từ transcript.';
    if (/grammar|ngữ pháp|câu ghép|câu phức/.test(query)) return '### Luyện ngữ pháp\n- Kiểm tra thì, mạo từ và hòa hợp chủ vị.\n- Thử giải thích bằng because hoặc although.\n- Ví dụ: I enjoy cycling because it helps me relax.\nĐây là gợi ý chung; chưa kiểm tra hoặc sửa bài của bạn.';
    if (/lexical|vocab|từ vựng/.test(query)) return '### Luyện từ vựng\n- Học cụm từ theo chủ đề và dùng từ chính xác trong ngữ cảnh.\n- Ví dụ: make a decision, spend time with friends.\n- Ưu tiên diễn đạt rõ ý, tránh ép dùng từ khó.';
    return '### Luyện nói\n- Trả lời ý chính, giải thích lý do rồi đưa ví dụ.\n- Ghi âm, nghe lại và luyện lần hai.\nChế độ cục bộ cung cấp gợi ý chung; hãy cấu hình Gemini để nhận đánh giá.';
  }

  function blobToBase64(blob) {
    if (!blob || !blob.size) return Promise.resolve('');
    if (blob.size > 8 * 1024 * 1024) return Promise.reject(new Error('Audio vượt 8 MB. Hãy ghi âm bài ngắn hơn.'));
    return blob.arrayBuffer().then(function (buffer) {
      var bytes = new Uint8Array(buffer), binary = '';
      for (var i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      }
      return global.btoa(binary);
    });
  }
  function reviewAnswer(part, question, transcript, audioBlob) {
    transcript = normalize(transcript);
    if (!transcript && !(audioBlob && audioBlob.size)) return Promise.reject(new Error('Chưa có nội dung hoặc audio để chấm.'));
    return global.BandRoomExaminerReady.then(function () {
      if (!isOnline()) return reviewLocal(part, question, transcript);
      return blobToBase64(audioBlob).then(function (data) {
        var body = { part: Number(part), question: String(question || ''), transcript: transcript };
        if (data) body.audio = { mimeType: (audioBlob.type || 'audio/webm').split(';')[0], data: data };
        return client.review(body).then(function (review) {
          if (!review || !review.criteria || typeof review.summary_vi !== 'string') throw new Error('Gemini trả về bài chấm không hợp lệ.');
          return review;
        });
      });
    });
  }
  function chat(history) {
    return global.BandRoomExaminerReady.then(function () {
      if (!isOnline()) throw new Error('Chưa có khóa Gemini trong env.js.');
      return client.chat({ history: history || [] }).then(function (data) {
        if (!data || typeof data.text !== 'string' || !data.text.trim()) throw new Error('Máy chủ không trả về nội dung phản hồi.');
        return data.text;
      });
    });
  }

  function bandLabel(value) { return typeof value === 'number' && isFinite(value) ? value.toFixed(1) : 'chưa đánh giá'; }
  function gradeAnswers(answersByPart, mode, selectedPart) {
    var parts = mode === 'full' ? [1, 2, 3] : [Number(selectedPart)];
    var sections = [], partScores = [], complete = true;
    var sequence = Promise.resolve();
    parts.forEach(function (part) {
      var answers = ((answersByPart || {})[part] || []).filter(function (answer) {
        return normalize(answer.text) || (answer.audioBlob && answer.audioBlob.size);
      });
      var scores = [];
      if (!answers.length) complete = false;
      sequence = sequence.then(function () {
        sections.push('### Part ' + part);
        if (!answers.length) sections.push('Chưa có bài nói cho Part này.');
      });
      answers.forEach(function (answer, index) {
        sequence = sequence.then(function () {
          return reviewAnswer(part, answer.question, answer.text, answer.audioBlob).then(function (review) {
            sections.push('### Câu ' + (index + 1), String(answer.question || ''), review.summary_vi);
            Object.keys(review.criteria).forEach(function (key) {
              var names = { fluency_coherence: 'Fluency and Coherence', lexical_resource: 'Lexical Resource', grammatical_range_accuracy: 'Grammatical Range and Accuracy', pronunciation: 'Pronunciation' };
              if (names[key]) sections.push('- ' + names[key] + ': ' + bandLabel(review.criteria[key]));
            });
            (review.feedback_vi || []).forEach(function (tip) { sections.push('- ' + tip); });
            if (review.corrected_answer) sections.push('**Bản sửa ngữ pháp:** ' + review.corrected_answer);
            if (review.natural_answer) sections.push('**Gợi ý diễn đạt:** ' + review.natural_answer);
            (review.pronunciation_notes_vi || []).forEach(function (tip) { sections.push('- ' + tip); });
            if (typeof review.overall === 'number') scores.push(review.overall);
            else complete = false;
          });
        });
      });
      sequence = sequence.then(function () {
        if (scores.length === answers.length && scores.length) {
          partScores.push(scores.reduce(function (sum, score) { return sum + score; }, 0) / scores.length);
        }
      });
    });
    return sequence.then(function () {
      sections.push('### Kết quả luyện tập');
      if (complete && partScores.length === parts.length) {
        var band = Math.round(partScores.reduce(function (sum, score) { return sum + score; }, 0) / partScores.length * 2) / 2;
        sections.push('**Overall Speaking (ước tính luyện tập): ' + band.toFixed(1) + '**');
        sections.push('Điểm tổng hợp từ các câu đã nộp; đây là đánh giá luyện tập của AI, không phải kết quả thi chính thức.');
      } else sections.push('**Overall:** chưa đánh giá đầy đủ; cần bài nói và audio cho các phần đã chọn.');
      return sections.join('\n\n');
    });
  }

  global.AIExaminer = {
    SUGGESTED_PROMPTS: SUGGESTED_PROMPTS, formatMarkdown: formatMarkdown,
    buildGradingMessage: buildGradingMessage, buildGradingMessageFull: buildGradingMessageFull,
    gradeLocal: gradeLocal, gradeLocalFull: gradeLocalFull, replyLocal: replyLocal,
    reviewAnswer: reviewAnswer, reviewLocal: reviewLocal, gradeAnswers: gradeAnswers,
    testConnection:function(){return refreshStatus().then(function(){if(!isOnline())throw new Error('Chưa có GEMINI_KEY trong env.js.');return client.chat({history:[{role:'user',content:'Reply with OK only.'}]}).then(function(){return client.lastModel();});});},
    chat: chat, isOnline: isOnline, activeBackend: activeBackend, refreshStatus: refreshStatus
  };
  global.BandRoomExaminerReady = refreshStatus();
})(window);
