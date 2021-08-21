const fs = require('fs');
const path = require('path');

const { getSessionHTML } = require('./support');

(async () => {
  console.log('Fetching Sessions');
  try {
    const html = await getSessionHTML();
    const filename = path.join(__dirname, '..', 'sessions.html');
    fs.writeFileSync(filename, html);
  } catch (err) {
    console.error(err);
  }
})();
