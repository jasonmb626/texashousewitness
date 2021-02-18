/* loop through members-fullnames entries,
 * generate shell script to call node parseMemberPage.js for each entry
 * parseMemberPage.js creates a whole dom from each HTML file, so heap exceed crash
 * happens if don't separate out into specific node processes.
 * 
 * Followup: Reps 5760 and 5796 have no image, and the directory structure of where the image is stored
 * is now it "guesses" at surname. Manually fix these entries.
 */
const fs = require('fs');
const XLSX = require('xlsx');

const workbook = XLSX.readFile('members-fullnames.ods');
const members_fullnames = XLSX.utils.sheet_to_json(workbook.Sheets['members']);

const surnamesJSON = fs.readFileSync('member_surnames.json').toString();
const surnames = JSON.parse(surnamesJSON);

let foundSurname = {};

members_fullnames.forEach(member => {
    foundSurname = surnames.find(mem => mem.memberId === member.memberId);
    if (!foundSurname) {
        console.log('Missing ' + member.memberId)
    }
});

console.log(surnames.filter(mem => mem.memberId === '64'));