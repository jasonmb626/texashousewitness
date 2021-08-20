const fs = require('fs');
const path = require('path');

const { pool } = require('../../../db');

const {
  shouldProcessHTMLToJSON,
  setFileProcessedDTTM,
  wasFileUpdatedSinceLastProcessed,
} = require('../../support');
const { parseCommitteeHTMLToJSObj } = require('./support');

const HTMLDir = path.join(__dirname, '..', 'HTML');
const JSONDir = path.join(__dirname, '..', 'JSON');

const HTMLFiles = fs.readdirSync(HTMLDir);

(async () => {
  HTMLFiles.forEach(async (HTMLFileBase) => {
    const HTMLFile = path.join(HTMLDir, HTMLFileBase);
    if (wasFileUpdatedSinceLastProcessed(pool, HTMLFile)) {
      const html = fs.readFileSync(HTMLFile).toString();
      const committees = parseCommitteeHTMLToJSObj(html);

      const JSONFile = path.join(
        JSONDir,
        HTMLFileBase.replace('.html', '.json')
      );
      fs.writeFileSync(JSONFile, JSON.stringify(committees));
      await setFileProcessedDTTM(pool, HTMLFile);
    }
  });
})();
