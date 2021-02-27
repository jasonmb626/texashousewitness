const fs = require('fs');

let URLS = '';

try {
  URLS = fs.readFileSync('meetings/allMeetings.txt').toString();
} catch (err) {}

const thisRecord = JSON.parse(
  fs.readFileSync(`meetings/JSON/${process.argv[2]}`)
);

thisRecord.forEach((rec) => {
  URLS += `https://capitol.texas.gov${rec.URL}\n`;
});

fs.writeFileSync('meetings/allMeetings.txt', URLS);
