const { JSDOM } = require('jsdom');

function parseSessionHTML(html) {
  const sessions = [];
  const dom = new JSDOM(html).window.document;
  const cboLegSess = dom.getElementById('cboLegSess');
  const options = cboLegSess.getElementsByTagName('option');
  Array.from(options).forEach(async (option) => {
    const textContent = option.textContent;
    const leg = textContent.slice(0, 2);
    const session = textContent.slice(3, 4);
    const year = textContent.slice(-4);
    if (leg >= 75)
      //The data before 75th is unreliable or missing
      sessions.push({ leg, session, year });
  });
  return sessions;
}

module.exports = {
  parseSessionHTML,
};
