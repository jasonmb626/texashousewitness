const fs = require('fs');
const path = require('path');

const { wasHTMLUpdatedSinceLastProcessToJSON } = require('../../support');

const { parseMemberHTML } = require('./support');

const { getMemberIDFromMemberURL } = require('../dependencies');

const HTMLDir = path.join(__dirname, '..', 'HTML');
const JSONDir = path.join(__dirname, '..', 'JSON');

const HTMLFiles = fs.readdirSync(HTMLDir);

(async () => {
  HTMLFiles.forEach(async (HTMLFileBase) => {
    const HTMLFile = path.join(HTMLDir, HTMLFileBase);
    const memberId = getMemberIDFromMemberURL(HTMLFile);
    const JSONFile = path.join(JSONDir, memberId + '.json');
    if (wasHTMLUpdatedSinceLastProcessToJSON(HTMLFile, JSONFile)) {
      console.log('Processing ' + HTMLFile);
      const html = fs.readFileSync(HTMLFile).toString();
      const member = parseMemberHTML(memberId, html);
      if (member) {
        fs.writeFileSync(JSONFile, JSON.stringify(member));
      }
    }
  });
})();