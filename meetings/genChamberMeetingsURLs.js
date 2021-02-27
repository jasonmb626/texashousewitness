const fs = require('fs');

const BASE_URL =
  'https://capitol.texas.gov/Committees/MeetingsByCmte.aspx?Leg=%LEG%&Chamber=%CHAMBER%&CmteCode=%CODE%';

const committees = JSON.parse(
  fs.readFileSync(`../committees/JSON/${process.argv[2]}`).toString()
);

let URLS = '';

committees.forEach((committee) => {
  const URL = BASE_URL.replace('%LEG%', committee.leg)
    .replace('%CHAMBER%', committee.chamber)
    .replace('%CODE%', committee.cmteCode);
  URLS += URL + '\n';
});

fs.writeFileSync(process.argv[2].replace('.json', '.txt'), URLS);
