const fs = require('fs');
const jsdom = require('jsdom');

const inFileName = process.argv[2];

const html = fs
  .readFileSync(`witnessTestimony/HTML/${inFileName}`, {
    encoding: 'utf8',
  })
  .toString();
const { JSDOM } = jsdom;
const dom = new JSDOM(html).window.document;

const records = [];
let searchStr;
let startIndex = -1;
let endIndex = -1;

let billName = '';
let billCode = '';
let session = '';
let position = '';
let witnessName = '';
let witnessOrg = '';
let self = false;
let rbnt = false;
let committee = '';
let dttm = '';

const Ps = dom.getElementsByTagName('p');
Array.from(Ps).forEach((p, i) => {
  const sp = p.firstChild;
  console.log(sp);
  if (i === 0) {
    // do nothing
  } else if (i === 1) {
    committee = sp.textContent.replace('\xA0', '').trim();
    for (let x = 0; x < 5; x++) {
      console.log(committee.charCodeAt(x));
    }
  } else if (i === 2) {
    dttm = sp.textContent.trim();
  } else {
    if (sp.innerHTML.contains('/BillLookup/History.aspx?')) {
      const a = sp.getElementsByTagName('a')[0];
      const href = a.getAttribute('href');

      searchStr = 'LegSess=';
      startIndex = href.indexOf(searchStr) + searchStr.length;
      endIndex = href.indexOf('&', startIndex);
      session = href.substring(startIndex, endIndex);
      searchStr = 'Bill=';
      startIndex = href.indexOf(searchStr, startIndex) + searchStr.length;
      endIndex = href.indexOf('"', startIndex);
      billCode = href.substring(startIndex, endIndex);
      billName = a.firstChild.textContent;
      position = '';
      witness = '';
      self = false;
      rbnt = false;
    } else if (sp.textContent.contains('For:')) {
      position = 'For';
    } else if (sp.textContent.contains('On:')) {
      position = 'On';
    } else if (sp.textContent.contains('Against:')) {
      position = 'Against';
    } else if (
      sp.innerHTML.contains('Registering, but not testifying:Against:')
    ) {
      rbnt = true;
    } else {
      const fullWitnessName = sp.textContent.trim();
      records.push({
        meetingCode: inFileName,
        committee,
        dttm,
        session,
        billName,
        billCode,
        position,
        rbnt,
        fullWitnessName,
      });
    }
  }
});

fs.writeFileSync(
  `witnessTestimony/JSON/${inFileName.replace('.HTM', '.json')}`,
  JSON.stringify(records)
);
