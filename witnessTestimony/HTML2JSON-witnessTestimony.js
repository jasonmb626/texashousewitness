const fs = require('fs');
const path = require('path');

const strategyA = require(path.join('strategies', 'a.js'));

const inFileName = process.argv[2];
const outFileName = `${inFileName.replace('.HTM', '.json')}`;

const html = fs
  .readFileSync(path.join('witnessTestimony', 'HTML', inFileName))
  .toString();

const records = [];

strategyA.scrape(html);

fs.writeFileSync(
  path.join('witnessTestimony', 'JSON', outFileName),
  JSON.stringify(records)
);

console.log(`Processed ${inFileName}`);
