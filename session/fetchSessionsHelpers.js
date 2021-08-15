const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { insertSession } = require('./db');

async function getSessionHTML() {
  const res = await fetch('https://capitol.texas.gov');
  return await res.text();
}

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

async function insertSessionsToDB(sessions, pool) {
  const insertPromises = [];
  sessions.forEach(({ leg, session, year }) => {
    insertPromises.push(insertSession(pool, leg, session, year));
  });
  await Promise.all(insertPromises);
}

module.exports = {
  insertSessionsToDB,
  getSessionHTML,
  parseSessionHTML,
};
