function parseCommitteeHTMLToJSObj(html) {
  const { JSDOM } = require('jsdom');

  const dom = new JSDOM(html).window.document;

  const form = dom.getElementById('ctl00');

  const committees = [];

  const LIs = form.getElementsByTagName('li');
  let startIndex = -1;
  let endIndex = -1;
  Array.from(LIs).forEach((li) => {
    const name = li.textContent;
    const a = li.getElementsByTagName('a')[0];
    const href = a.getAttribute('href');

    let searchStr = 'Leg=';
    startIndex = href.indexOf(searchStr) + searchStr.length;
    endIndex = href.indexOf('&', startIndex);
    const leg = href.substring(startIndex, endIndex);
    searchStr = 'Chamber=';
    startIndex = href.indexOf(searchStr) + searchStr.length;
    endIndex = href.indexOf('&', startIndex);
    const chamber = href.substring(startIndex, endIndex);
    searchStr = 'CmteCode=';
    startIndex = href.indexOf(searchStr) + searchStr.length;
    endIndex = href.length;
    const code = href.substring(startIndex, endIndex);

    committees.push({
      name,
      leg,
      chamber,
      code,
    });
  });
  return committees;
}

module.exports = { parseCommitteeHTMLToJSObj };
