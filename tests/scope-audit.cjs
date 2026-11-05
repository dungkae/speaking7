
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const baseline = process.argv[2];
assert.ok(baseline, 'Pass the original project directory as argument');
const allowed = new Set(['index.html', 'preview.html', 'account.html', 'assets/js/features/questions/question-assist.js', 'tests/smoke-test.cjs', 'tests/controller-regression.cjs', 'README.md']);
function walk(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name;
    return entry.isDirectory() ? walk(path.join(dir, entry.name), relative + '/') : [relative];
  });
}
let unchanged = 0;
for (const file of walk(baseline)) {
  assert.ok(fs.existsSync(path.join(root, file)), 'Original file removed: ' + file);
  if (allowed.has(file)) continue;
  const before = fs.readFileSync(path.join(baseline, file));
  const after = fs.readFileSync(path.join(root, file));
  if (file === 'assets/js/app/main.js') {
    function outsideAssist(buffer) {
      const text = buffer.toString('utf8');
      const start = text.indexOf('  function assistListHtml(');
      const end = text.indexOf('  var storeAudioBlob =', start);
      assert.ok(start >= 0 && end > start);
      return text.slice(0, start) + text.slice(end);
    }
    assert.equal(outsideAssist(after), outsideAssist(before), 'main.js changed outside question helper rendering');
  } else assert.ok(before.equals(after), 'Out-of-scope file changed: ' + file);
  unchanged++;
}
console.log('PASS: ' + unchanged + ' original files unchanged or main.js limited to helper rendering; Gemini/auth/speech/history/topics/navigation preserved.');
