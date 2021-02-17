const fs = require('fs');
const XLSX = require('xlsx');

const workbook = XLSX.readFile('members-fullnames.ods');
const members_fullnames = XLSX.utils.sheet_to_json(workbook.Sheets['members']);

let buffer = '#!/bin/bash\nrm -f member_surnames.json';

members_fullnames.forEach(member => {
    buffer += 'node parseMemberPage.js ' + member.memberId + ' "' +  member.memberFullName + '"\n';
});

fs.writeFileSync('parseMemberPages.sh', buffer.trim());