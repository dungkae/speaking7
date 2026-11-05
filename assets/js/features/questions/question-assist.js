/* Nội dung luyện tập tĩnh: dịch, cách trả lời và ý tưởng theo câu hỏi. */
(function(global){
  'use strict';
  var data=global.BandRoomData;
  function normalise(text){
    return String(text == null ? '' : text).replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim().toLowerCase().replace(/[?.!]+$/,'').trim();
  }
  var questions=Object.create(null), translations=Object.create(null);
  data.TOPICS.forEach(function(topic){
    topic.part1.concat([topic.part2.title],topic.part3).forEach(function(question){questions[normalise(question)]=question;});
  });
  Object.keys(data.TRANSLATIONS).forEach(function(text){translations[normalise(text)]=data.TRANSLATIONS[text];});
  function translation(text){ return translations[normalise(text)] || text; }
  function forQuestion(question,topic,part){
    var text=question && typeof question==='object'?question.title:question;
    var canonical=questions[normalise(text)] || text;
    var coaching=global.BandRoomHints.forQuestion(canonical,topic,part);
    var cue=topic && topic.part2;
    return {
      words:coaching.words,
      hints:coaching.hints,
      ideas:global.BandRoomIdeas.forQuestion(canonical,topic,part),
      translation:translation(canonical),
      translatedBullets:Number(part)===2 && cue?(cue.bullets||[]).map(translation):[]
    };
  }
  global.BandRoomQuestionAssist={forQuestion:forQuestion};
})(window);
