const fs = require('fs');
const path = require('path');

const {
  parseMemberHTML,
  shouldProcessMemberHTML,
  getMemberFileNameWMTimes,
} = require('./support');
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
  const fileMTimes = getMemberFileNameWMTimes(HTMLDir);

  const shouldProcessHTML = shouldProcessMemberHTML(101, fileMTimes, []);
  expect(shouldProcessHTML).toBe(true);
});
