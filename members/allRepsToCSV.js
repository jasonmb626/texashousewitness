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
const {JSDOM} = jsdom;

const members = [];

for (let i = 75; i <= 86; i++) {
  const html = fs.readFileSync(i + '.html').toString();
  const dom = new JSDOM(html).window.document;
  const table = dom.querySelector('#tableToSort');
  const rows = table.getElementsByTagName('tr');
  console.log(rows.length);
  Array.from(rows).forEach((row, index) => {
    if (index > 0) {
      const columns = row.getElementsByTagName('td');
      const memberFullName = columns[0].children[0].innerHTML;
      const URL = columns[0].children[0].getAttribute('href');
      const startPos = URL.indexOf('memberID=') + 'memberID='.length;
      const endPos = URL.indexOf('&', startPos);
      const memberId = URL.slice(startPos, endPos);
      members.push({memberId, memberFullName});
    }
  });
};
let buffer = '';
members.forEach(member => buffer += member.memberId + '\t' + member.memberFullName + '\n');
fs.writeFileSync('member.csv', buffer);
//^i't:a'wi'g_a',j
