/* loop through members-fullnames entries,
 * Strip out nickname if present.
 * Afterwards, if more than two "names" then parse mamber page to determine actual
 * surname.
 * generate shell script to call node parseMemberPage.js for each entry
 * parseMemberPage.js creates a whole dom from each HTML file, so heap exceed crash
 * happens if don't separate out into specific node processes.
 * Followup: Reps 5760 and 5796 have no image, and the directory structure of where the image is stored
 * is now it "guesses" at surname. Manually fix these entries.
 */
const fs = require('fs');
const XLSX = require('xlsx');

const workbook = XLSX.readFile('members-fullNames.ods');
const membersFullnames = XLSX.utils.sheet_to_json(workbook.Sheets.members);

const surnamesJSON = fs.readFileSync('member_surNames.json').toString();
const surnames = JSON.parse(surnamesJSON);

let foundSurname = {};
console.log('Checking...');
membersFullnames.forEach((member) => {
  foundSurname = surnames.find((mem) => mem.memberId === member.memberId);
  if (!foundSurname) {
    console.log(`Missing ${member.memberId}`);
  }
});
console.log('Done...');

console.log(surnames.filter((mem) => mem.memberId === '64'));
