const fs = require('fs');
const path = require('path');

const { parseCommitteeHTMLToJSObj } = require('./support');

const committeeMatch = require('../testData/committee.json');

it.skip('Correctly parses committee HTML to JS Obj', () => {
  const filename = path.join(__dirname, '..', 'HTML', 'H_75.html');
  const html = fs.readFileSync(filename).toString();
  const committee = parseCommitteeHTMLToJSObj(html);
  expect(committee).toStrictEqual(committeeMatch);
});
