const fs = require('fs');
const path = require('path');

const { shouldProcessHTMLToJSON } = require('../../support');
const { parseCommitteeHTMLToJSObj } = require('./support');

const HTMLDir = path.join(__dirname, '..', 'HTML');
const JSONDir = path.join(__dirname, '..', 'JSON');

const HTMLFiles = fs.readdirSync(HTMLDir);

HTMLFiles.forEach((HTMLFileBase) => {
  const HTMLFile = path.join(HTMLDir, HTMLFileBase);
  if (shouldProcessHTMLToJSON(HTMLFile, JSONFile)) {
    const html = fs.readFileSync(HTMLFile).toString();
    const committees = parseCommitteeHTMLToJSObj(html);
    committees.forEach((committee) => {
      const { leg, chamber, code } = committee;
      const JSONFile = path.join(JSONDir, `${leg}_${chamber}_${code}`);
      fs.writeFileSync(JSONFile, JSON.stringify(committee));
    });
  }
});
