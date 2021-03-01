const fs = require('fs');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const html = fs.readFileSync(`HTML/${process.argv[2]}`).toString();
const dom = new JSDOM(html).window.document;

const form = dom.getElementById('ctl00');

const committees = [];

const LIs = form.getElementsByTagName('li');
let startIndex = -1;
let endIndex = -1;
Array.from(LIs).forEach((li) => {
  const cmteName = li.textContent;
  const a = li.getElementsByTagName('a')[0];
  const href = a.getAttribute('href');

  let searchStr = 'Leg=';
  startIndex = href.indexOf(searchStr) + searchStr.length;
  endIndex = href.indexOf('&', startIndex);
  const leg = href.substring(startIndex, endIndex);
  console.log(href);
  searchStr = 'Chamber=';
  startIndex = href.indexOf(searchStr) + searchStr.length;
  endIndex = href.indexOf('&', startIndex);
  const chamber = href.substring(startIndex, endIndex);
  searchStr = 'CmteCode=';
  startIndex = href.indexOf(searchStr) + searchStr.length;
  endIndex = href.length;
  const cmteCode = href.substring(startIndex, endIndex);

  committees.push({
    cmteName,
    leg,
    chamber,
    cmteCode,
  });
});

fs.writeFileSync(
  `JSON/${process.argv[2].replace('.html', '.json')}`,
  JSON.stringify(committees)
);
