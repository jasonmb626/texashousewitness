const fs = require('fs');
const path = require('path');

const { wasHTMLUpdatedSinceLastProcessToJSON } = require('../../support');
const { parseCommitteeHTMLToJSObj } = require('./support');

const HTMLDir = path.join(__dirname, '..', 'HTML');
const JSONDir = path.join(__dirname, '..', 'JSON');

const HTMLFiles = fs.readdirSync(HTMLDir);

(async () => {
  HTMLFiles.forEach(async (HTMLFileBase) => {
    const HTMLFile = path.join(HTMLDir, HTMLFileBase);
    const JSONFile = path.join(JSONDir, HTMLFileBase.replace('.html', '.json'));
    if (wasHTMLUpdatedSinceLastProcessToJSON(HTMLFile, JSONFile)) {
      const html = fs.readFileSync(HTMLFile).toString();
      const committees = parseCommitteeHTMLToJSObj(html);

      fs.writeFileSync(JSONFile, JSON.stringify(committees));
    }
  });
})();
