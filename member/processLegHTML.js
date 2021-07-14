const fs = require('fs');
const path = require('path');

const jsdom = require('jsdom');

const {JSDOM} = jsdom;

const {get1UnprocessedLegHTML} = require('./db');
const { fileURLToPath } = require('url');

(async () => {
	const fileToProcess = await get1UnprocessedLegHTML();
	const html = fs.readFileSync(path.join('HTML/' + fileToProcess)).toString();
  const dom = new JSDOM(html).window.document;
  const table = dom.querySelector('#tableToSort');
  const rows = table.getElementsByTagName('tr');
  console.log(rows.length);
  Array.from(rows).forEach((row, index) => {
    if (index > 0) {
      const columns = row.getElementsByTagName('td');
      const URL = columns[0].children[0].getAttribute('href');
      const startPos = URL.indexOf('memberID=') + 'memberID='.length;
      const endPos = URL.indexOf('&', startPos);
      const memberId = URL.slice(startPos, endPos);
      representations.push({legislature: i, memberId, district, chamber, party, city, county});
    }
  });
})();