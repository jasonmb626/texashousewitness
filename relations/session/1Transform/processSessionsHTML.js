const fs = require('fs');
const path = require('path');

const { parseSessionHTML } = require('./processSessionsHTML/support');

try {
  const basepath = path.join(__dirname, '..');
  const htmlfilename = path.join(basepath, 'sessions.html');
  const html = fs.readFileSync(htmlfilename).toString;

  const sessions = parseSessionHTML(html);

  const jsonfilename = path.join(basepath, 'sessions.json');

  fs.writeFileSync(jsonfilename, JSON.stringify(sessions));
} catch (err) {
  console.error(err);
}
