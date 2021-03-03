const fs = require('fs');
const path = require('path');

const BASE_URL =
  'https://capitol.texas.gov/Committees/MeetingsByCmte.aspx?Leg=%LEG%&Chamber=%CHAMBER%&CmteCode=%CODE%';

const data = JSON.parse(
  fs.readFileSync(path.join('committee', 'committee.JSON')).toString()
);

let URLS = '';

data.forEach((committee) => {
  const URL = BASE_URL.replace('%LEG%', committee.leg)
    .replace('%CHAMBER%', committee.chamber)
    .replace('%CODE%', committee.cmteCode);
  URLS += URL + '\n';
});

fs.writeFileSync(path.join('meeting', 'URLs.txt'), URLS);
