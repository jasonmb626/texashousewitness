const fs = require('fs');
const path = require('path');
const { getSessionHTML, parseSessionHTML } = require('./fetchSessionsHelpers');

const {
  getHTMLDataForLeg,
} = require('../representation/fetchRepresentationHTMLForLegHelpers');

const sessionsMatch = require('./sessions.json');

it.skip('Fetches HTML data for given legislature', async () => {
  const html = await getHTMLDataForLeg(75);
  // const filename = path.join(__dirname, '75.html');
  // fs.writeFileSync('75.html', html);
});
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
