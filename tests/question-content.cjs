
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: null }; context.window = context;
vm.createContext(context);
for (const file of ['data/topics.js', 'data/translations.js', 'data/question-hints.js', 'data/question-ideas.js', 'features/questions/question-assist.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/js', file), 'utf8'), context, { filename: file });
}
const topics = context.BandRoomData.TOPICS;
assert.equal(topics.length, 30);
const ideasSeen = new Set(), hintsSeen = new Set();
let questions = 0, bullets = 0;
function contentList(items, min, label) {
  assert.ok(Array.isArray(items), label + ': array');
  assert.ok(items.length >= min, label + ': enough items');
  assert.equal(new Set(items).size, items.length, label + ': repeated item');
  for (const item of items) {
    assert.equal(typeof item, 'string', label + ': string');
    assert.ok(item.trim().length >= 4, label + ': empty/short text');
    assert.ok(!/undefined|\[object Object\]|TODO|�/.test(item), label + ': corrupt/placeholder text');
  }
}
for (const topic of topics) {
  for (const [part, entries] of [[1, topic.part1], [2, [topic.part2.title]], [3, topic.part3]]) {
    for (const question of entries) {
      const result = context.BandRoomQuestionAssist.forQuestion(question, topic, part);
      assert.ok(result.translation && result.translation !== question, 'Missing translation: ' + question);
      assert.ok(/[À-ỹ]/.test(result.translation), 'Vietnamese expected: ' + question);

      // Equivalent typography must still find the same translation and ideas.
      const variants = [question.toUpperCase(), '  ' + question.replace(/ /g, '  ') + '  ', question.replace(/[?.]$/, ''), question.replace(/'/g, '’')];
      for (const variant of variants) {
        const found = context.BandRoomQuestionAssist.forQuestion(variant, topic, part);
        assert.equal(found.translation, result.translation, 'Typography lost translation: ' + question);
        assert.deepEqual(found.ideas, result.ideas, 'Typography lost ideas: ' + question);
        assert.deepEqual(found.hints, result.hints, 'Typography changed hints: ' + question);
      }
      if (part === 3) {
        assert.ok(!result.hints.some(text => /I’d rather|I prefer|I’d like to/.test(text)), 'Personal preference template in a social discussion: ' + question);
      }
      contentList(result.hints, 5, 'Hints: ' + question);
      contentList(result.ideas, 4, 'Ideas: ' + question);
      contentList(result.words, 6, 'Words: ' + question);
      const ideaKey = JSON.stringify(result.ideas), hintKey = JSON.stringify(result.hints);
      assert.ok(!ideasSeen.has(ideaKey), 'Repeated full idea set: ' + question);
      assert.ok(!hintsSeen.has(hintKey), 'Repeated full hint set: ' + question);
      ideasSeen.add(ideaKey); hintsSeen.add(hintKey);
      if (part === 2) {
        assert.equal(result.translatedBullets.length, topic.part2.bullets.length);
        result.translatedBullets.forEach((translated, i) => {
          assert.ok(translated && translated !== topic.part2.bullets[i], 'Missing cue translation: ' + topic.part2.bullets[i]);
          assert.ok(/[À-ỹ]/.test(translated)); bullets++;
        });
      }
      questions++;
    }
  }
}
assert.equal(questions, 270); assert.equal(bullets, 120);
console.log('PASS: 270 questions, 120 cue bullets translated; 270 distinct hints and idea sets; vocabulary coverage.');
