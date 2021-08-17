const fs = require('fs');
const jsdom = require('jsdom');
const { start } = require('repl');

const inFileName = process.argv[2];
let searchStr = 'Leg=';
let startIndex = inFileName.indexOf(searchStr) + searchStr.length;
let endIndex = inFileName.indexOf('&', startIndex);
const leg = inFileName.substring(startIndex, endIndex);
searchStr = 'Chamber=';
startIndex = inFileName.indexOf(searchStr) + searchStr.length;
endIndex = inFileName.indexOf('&', startIndex);
const chamber = inFileName.substring(startIndex, endIndex);
searchStr = 'CmteCode=';
startIndex = inFileName.indexOf(searchStr) + searchStr.length;
endIndex = inFileName.length;
const cmte = inFileName.substring(startIndex, endIndex);

const meetings = [];

const html = fs.readFileSync(`meeting/HTML/${process.argv[2]}`).toString();

const { JSDOM } = jsdom;
const dom = new JSDOM(html).window.document;

const table = dom.getElementById('tblMeetings');
const TRs = table.getElementsByTagName('tr');

Array.from(TRs).forEach((tr) => {
  const TDs = tr.getElementsByTagName('td');
  let DTTM = '';

  Array.from(TDs).forEach((td, i) => {
    // console.log(`${i} *${td.innerHTML}*`);
  });
  if (TDs[1] && TDs[1].textContent !== '' && TDs[1].textContent !== 'Time') {
    DTTM = makePostgresDTTMString(TDs[0].textContent, TDs[1].textContent);
    if (TDs[5]) {
      // console.log(TDs[5].innerHTML);
      const a = TDs[5].getElementsByTagName('a')[0];
      if (a) {
        meetings.push({
          leg,
          chamber,
          cmte,
          DTTM,
          URL: a.getAttribute('href'),
        });
      }
    }
  }
});

fs.writeFileSync(`meeting/JSON/${inFileName}.json`, JSON.stringify(meetings));

function makePostgresDTTMString(dateStr, timeStr) {
  startIndex = 0;
  endIndex = dateStr.indexOf('/');
  const month = parseInt(dateStr.substring(startIndex, endIndex));
  startIndex = endIndex + 1;
  endIndex = dateStr.indexOf('/', startIndex);
  const day = parseInt(dateStr.substring(startIndex, endIndex));
  startIndex = endIndex + 1;
  endIndex = dateStr.length;
  const year = parseInt(dateStr.substring(startIndex, endIndex));

  startIndex = 0;
  endIndex = timeStr.indexOf(':');
  let hour = parseInt(timeStr.substring(startIndex, endIndex));
  startIndex = endIndex + 1;
  endIndex = timeStr.indexOf(' ', startIndex);
  const minute = parseInt(timeStr.substring(startIndex, endIndex));
  startIndex = endIndex + 1;
  endIndex = timeStr.indexOf(' ', startIndex);
  if (endIndex === -1) endIndex = timeStr.length;
  const AMPM = timeStr.substring(startIndex, endIndex);

  if (hour === 12 && AMPM === 'AM') {
    hour = 0;
  } else if (AMPM === 'PM') {
    if (hour != 12) {
      hour += 12;
    }
  }

  return `${year}-${month
    .toString()
    .padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')} ${hour
    .toString()
    .padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
