const fs = require('fs');
const path = require('path');

console.log(__dirname);

const strategyA = require('./strategies/a');
// const strategyB = require('./strategies/b');
const strategyC = require('./strategies/c');
//get a list of input files from the commandline
//find . -type f

let searchStr = './capitol.texas.gov/tlodocs/';
let startIndex = process.argv[2].indexOf(searchStr) + searchStr.length;
let endIndex = process.argv[2].indexOf('/', startIndex);
let session = process.argv[2].substring(startIndex, endIndex);
let leg = session.substring(0, 2);

const inFileName = path.basename(process.argv[2]);

const outFileName = `${inFileName.replace('.HTM', '.json')}`;

const html = fs
  .readFileSync(path.join('witnessTestimony', 'HTML', process.argv[2]))
  .toString();

const meeting_cd = inFileName.replace('.HTM', '');
let scrape;

switch (parseInt(leg)) {
  case 75:
    scrape = strategyA.scrape;
    break;
  case 86:
    scrape = strategyC.scrape;
    break;
}

const records = scrape(html, meeting_cd);

fs.writeFileSync(
  path.join('witnessTestimony', 'JSON', outFileName),
  JSON.stringify(records)
);

console.log(`Processed ${inFileName}`);
