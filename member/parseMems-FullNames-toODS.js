/*
 * This script reads from 75.html, 76.html, etc (each number represents a legislature.
 * It loops through the members table and parses the memberIds from the urls to their individual pages
 * and reads the member names from the same cell. As there are duplicates between legislatures it doesn't add
 * a record from leg 76 if it was already there in 75, etc. This step is literally just to get all member names and IDs.
 *
 * It outputs the data to an ODS file.
 *
 * Creates a url-list file for wget to download individual memeber pages
 *
 * Followup necessary:
 *  *wget all member pages from url file created below
 *  *genParseMemberPagesScript.js ==> generates a shell script parseMemberPages.sh
 *  *run parseMemberPages.sh ==> outputs member_surnames.json -- surnames linked to member IDs.
 *  *with that
 *  parse the full names to separate out:
 *  *given name
 *  *middle initial (if applicable)
 *  *nickname (if applicable)
 *  from the surname
 *  *output full ODS
 */

const fs = require('fs');
const jsdom = require('jsdom');
const XLSX = require('xlsx');
const { JSDOM } = jsdom;
let buffer = '';

const members = [];
const membersSet = new Set();

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
      if (!membersSet.has(memberId + memberFullName)) {
        membersSet.add(memberId + memberFullName);
        members.push({ memberId, memberFullName });
        buffer =
          buffer +
          'https://lrl.texas.gov/legeLeaders/members/memberDisplay.cfm?memberID=' +
          memberId +
          '\n';
      }
    }
  });
}

/* create a new blank workbook */
const wb = XLSX.utils.book_new();
/* make worksheet */
const ws = XLSX.utils.json_to_sheet(
  members.sort(
    (mem1, mem2) => parseInt(mem1.memberId) - parseInt(mem2.memberId)
  )
);
/* Add the worksheet to the workbook */
XLSX.utils.book_append_sheet(wb, ws, 'members');
/* output format determined by filename */
XLSX.writeFile(wb, 'members-fullNames.ods');
console.log('Workbook written!');

//write out list of URLs to download.
//download with: wget -i members-urls.txt -w 3
fs.writeFileSync('members-urls.txt', buffer.trim());
