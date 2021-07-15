/*
 * This script reads from 75.html, 76.html, etc (each number represents a legislative session
 * It loops through the members table and strips the memberIds from the urls to their individual pages
 * and reads the member names from the same cell.
 *
 * Finally it outputs the data as a csv (tab separated values).
 *
 * Manual followup required: remove duplicates and tabulate first/last/nicknames
 *
 */
const fs = require('fs');
const jsdom = require('jsdom');
const XLSX = require('xlsx');

const {JSDOM} = jsdom;

const representations = [];

for (let i = 75; i <= 86; i++) {
  const html = fs.readFileSync(i + '.html').toString();
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
      const district = columns[2].textContent.trim();
      const chambers = columns[3].textContent.trim();
      const legislatures = columns[5].textContent.trim();
      const parties = columns[6].textContent.trim();
      const city = columns[7].textContent.trim();
      const county = columns[8].textContent.trim();
      const index = decodeLegislatures(legislatures).findIndex(leg => leg.start <= i && leg.end >= i);
      const chamber=chambers.split('\n')[index].trim();
      const party=parties.split('\n')[index].trim();
      representations.push({legislature: i, memberId, district, chamber, party, city, county});
    }
  });
};

console.log(representations);


/* create a new blank workbook */
const wb = XLSX.utils.book_new();
/* make worksheet */
const ws = XLSX.utils.json_to_sheet(representations);
/* Add the worksheet to the workbook */
XLSX.utils.book_append_sheet(wb, ws, 'representations');
/* output format determined by filename */
XLSX.writeFile(wb, 'reps.ods');
console.log('Workbook written!')
