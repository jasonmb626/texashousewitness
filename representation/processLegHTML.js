const fs = require('fs');
const path = require('path');

const jsdom = require('jsdom');

const {JSDOM} = jsdom;

const {get1UnprocessedLegHTML, insertWork_RepresentationRecord} = require('./db');

(async () => {
	const fileToProcess = await get1UnprocessedLegHTML();
	const html = fs.readFileSync(path.join('HTML/' + fileToProcess)).toString();
  const dom = new JSDOM(html).window.document;
  const table = dom.querySelector('#tableToSort');
  const rows = table.getElementsByTagName('tr');
  Array.from(rows).forEach((row, index) => {
    if (index > 0) {
      const columns = row.getElementsByTagName('td');
      const URL = columns[0].children[0].getAttribute('href');
      const district = columns[2].textContent.trim();
      const chambers = columns[3].textContent.trim();
      const legislatures = columns[5].textContent.trim();
      const parties = columns[6].textContent.trim();
      const city = columns[7].textContent.trim();
      const county = columns[8].textContent.trim();
      const index = decodeLegislatures(legislatures).findIndex(leg => leg.start <= i && leg.end >= i);
      const chamber=chambers.split('\n')[index].trim();
      const party=parties.split('\n')[index].trim();
      representations.push({i, URL, district, chamber, party, city, county});
    }
  });
})();