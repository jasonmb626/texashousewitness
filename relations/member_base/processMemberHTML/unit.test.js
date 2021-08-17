const fs = require('fs');
const path = require('path');
const { hasUncaughtExceptionCaptureCallback } = require('process');

const { parseMemberHTML } = require('./support');
it('Correctly parses member HTML to JS Obj', () => {
  const memberMatch = {
    memberId: 243,
    givenName: 'Senfronia',
    nickName: '',
    surnames: [
      { surName: 'Thompson', current: true },
      { surname: 'Carrington', current: false },
      { surname: 'Paige', current: false },
    ],
  };
  const filename = path.join(
    __dirname,
    '..',
    'HTML',
    'memberDisplay.cfm?memberID=243'
  );
  const html = fs.readFileSync(filename).toString();
  const member = parseMemberHTML(html);
  expect(member).toStrictEqual(memberMatch);
});
