const fs = require('fs');
const path = require('path');

const { parseSessionHTML } = require('./support');

const sessionsMatch = require('../testData/sessions.json');

it('Processes session HTML to JS Obj', () => {
  const filename = path.join(__dirname, '..', 'testData', 'index.html');
  const html = fs.readFileSync(filename).toString();
  const sessions = parseSessionHTML(html);
  expect(sessions).toStrictEqual(sessionsMatch);
});
