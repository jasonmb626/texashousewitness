const fs = require('fs');
const path = require('path');

const { parseSessionHTML } = require('./support');
const { wasHTMLUpdatedSinceLastProcessToJSON } = require('../../support');

(async () => {
  try {
    const basepath = path.join(__dirname, '..');
    const htmlfilename = path.join(basepath, 'sessions.html');
    const html = fs.readFileSync(htmlfilename).toString();
    const jsonfilename = path.join(basepath, 'sessions.json');

    if (wasHTMLUpdatedSinceLastProcessToJSON(htmlfilename, jsonfilename)) {
      const sessions = parseSessionHTML(html);
      fs.writeFileSync(jsonfilename, JSON.stringify(sessions));
    }
  } catch (err) {
    console.error(err);
  }
})();
