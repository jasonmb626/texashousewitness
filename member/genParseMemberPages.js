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

const workbook = XLSX.readFile('members/members-fullnames.ods');
const membersFullnames = XLSX.utils.sheet_to_json(workbook.Sheets.members);

let buffer = '#!/bin/bash\nrm -f member_surNames.json\n';

membersFullnames.forEach((member) => {
  buffer += `node parseMemberPage.js ${member.memberId} "${member.memberFullName}"\n`;
});

fs.writeFileSync('members/parseMemberPages.sh', buffer.trim());
