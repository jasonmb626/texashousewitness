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
const Excel = require('exceljs');

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
      const district = columns[2].innerHTML.trim();
      const chamber = columns[3].innerHTML.trim().slice(0, 1);
      const party = columns[6].innerHTML.trim().slice(0, 1);
      const city = columns[7].innerHTML.trim();
      const county = columns[8].innerHTML.trim();
      representations.push({legislature: i, memberId, district, chamber, party, city, county});
    }
  });
};

console.log(representations);

const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet('representations');

worksheet.columns = [
  {header: 'Legislature', key: 'legislature'},
  {header: 'memberId', key: 'memberId'},
  {header: 'district', key: 'district'},
  {header: 'chamber', key: 'chamber'},
  {header: 'party', key: 'party'},
  {header: 'city', key: 'city'},
  {header: 'county', key: 'county'},
]

worksheet.getRow(1).font = {bold: true};

let buffer = '';
representations.forEach(rep => worksheet.addRow({...rep}));
workbook.xlsx.writeFile('reps.ods');
//^i't:a'wi'g_a',j
