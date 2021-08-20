const fs = require('fs');
const path = require('path');

const { pool } = require('../../db');
const { parseSessionHTML } = require('./processSessionsHTML/support');
const { setFileProcessedDTTM } = require('../../support');

(async () => {
  try {
    const basepath = path.join(__dirname, '..');
    const htmlfilename = path.join(basepath, 'sessions.html');
    const html = fs.readFileSync(htmlfilename).toString;

    const sessions = parseSessionHTML(html);

    const jsonfilename = path.join(basepath, 'sessions.json');

    fs.writeFileSync(jsonfilename, JSON.stringify(sessions));
    await setFileProcessedDTTM(pool, htmlfilename);
  } catch (err) {
    console.error(err);
  }
})();
