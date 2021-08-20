const fs = require('fs');
const path = require('path');

const { pool } = require('../../../db');

const { JSDOM } = require('jsdom');

const { getLegsWithNoRepresentation } = require('../db');
const { getMemberIDFromMemberURL } = require('./support');

const reps = [];

const legs = await getLegsWithNoRepresentation(pool);
legs.forEach(async (leg) => {
  const filename = path.join(__dirname, '..', 'HTML', leg + '.html');
  if (fs.existsSync(filename)) {
    const html = fs.readFileSync(filename).toString();
    const dom = new JSDOM(html).window.document;
    const table = dom.querySelector('#tableToSort');
    const rows = table.getElementsByTagName('tr');
    Array.from(rows).forEach((row, index) => {
      if (index > 0) {
        const columns = row.getElementsByTagName('td');
        const scrapedName = columns[0].children[0].textContent;
        const URL = columns[0].children[0].getAttribute('href');
        const memberId = getMemberIDFromMemberURL(URL);
        const district = columns[2].textContent.trim();
        const chambers = columns[3].textContent.trim();
        const legislatures = columns[5].textContent.trim();
        const parties = columns[6].textContent.trim();
        const city = columns[7].textContent.trim();
        const county = columns[8].textContent.trim();
        const index = decodeLegislatures(legislatures).findIndex(
          (l) => l.start <= leg && l.end >= leg
        );
        const chamber = chambers.split('\n')[index].trim();
        const party = parties.split('\n')[index].trim();
        reps.push({
          leg,
          scrapedName,
          URL,
          memberId,
          district,
          chamber,
          party,
          city,
          county,
        });
      }
    });
  }
});
const basepath = path.join(__dirname, '..');
const jsonfilename = path.join(basepath, 'reps.json');
try {
  fs.writeFileSync(jsonfilename, JSON.stringify(reps));
} catch (err) {
  console.error(err);
}
function decodeLegislatures(instr) {
  const legislatureRanges = instr.split('\t');
  const legislatures = [];
  legislatureRanges.forEach((range) => {
    if (range != '') {
      const legislaturesStr = range.trim().split('\n');
      const start = parseInt(legislaturesStr[0].trim().slice(0, 2));
      const ends = legislaturesStr[legislaturesStr.length - 1]
        .trim()
        .split('-');
      const end = parseInt(ends[ends.length - 1].trim().slice(0, 2));
      legislatures.push({ start, end });
    }
  });
  return legislatures;
}
