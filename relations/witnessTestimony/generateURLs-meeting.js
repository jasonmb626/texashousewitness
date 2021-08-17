const fs = require('fs');
const path = require('path');

const meetings = JSON.parse(
  fs.readFileSync(path.join('meeting', 'meeting.JSON')).toString()
);

let URLs = '';

meetings.forEach((meeting) => {
  URLs += `https://capitol.texas.gov${meeting.URL}\n`;
});

fs.writeFileSync(path.join('witnessTestimony', 'URLs.txt'), URLs);
