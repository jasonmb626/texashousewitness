const fs = require('fs');
const path = require('path');
const sessionsMatch = require('./sessions.json');
const {
  getSessionHTML,
  parseSessionHTML,
} = require('../../../session/fetchSessionsHelpers');

function getDBConnObj() {
  return {
    host: process.env['PGHOST'],
    port: process.env['PGPORT'],
    user: this.roleName,
    password: this.roleName,
    database: 'texashousewitness-test',
  };
}

it('Downloads session HTML', async () => {
  const html = await getSessionHTML();
  expect(html).toMatch(/Search Legislation/);
  expect(html).toMatch(/<option value="/i);
});

it('Processes session HTML to JS Obj', () => {
  const filename = path.join(__dirname, 'index.html');
  const html = fs.readFileSync(filename).toString();
  const sessions = parseSessionHTML(html);
  expect(sessions).toStrictEqual(sessionsMatch);
});
