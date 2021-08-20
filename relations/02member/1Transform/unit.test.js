const fs = require('fs');
const path = require('path');

const { parseMemberHTML, getMemberFileNameWMTimes } = require('./support');

const { shouldProcessHTMLToJSON } = require('../../support');
it('Correctly parses member HTML to JS Obj', () => {
  const memberMatch = {
    memberId: 243,
    givenName: 'Senfronia',
    nickName: '',
    surNames: [
      { surName: 'Thompson', current: true },
      { surName: 'Carrington', current: false },
      { surName: 'Paige', current: false },
    ],
  };
  const filename = path.join(
    __dirname,
    '..',
    'HTML',
    'memberDisplay.cfm?memberID=243'
  );
  const html = fs.readFileSync(filename).toString();
  const member = parseMemberHTML(243, html);
  expect(member).toStrictEqual(memberMatch);
});

it.skip('Successfully determines if member JSON file should be processed', () => {
  const HTMLDir = path.join(__dirname, '..', 'HTML');
  const JSONDir = path.join(__dirname, '..', 'JSON');

  const htmlfile = path.join(HTMLDir, 'memberDisplay.cfm?memberID=21');
  const jsonfile = path.join(JSONDir, '21.json');

  const shouldProcessHTML = shouldProcessHTMLToJSON(htmlfile, jsonfile);
  expect(shouldProcessHTML).toBe(false);
});
