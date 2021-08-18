const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

function wasMemberHTMLFetched(memberId) {
  const base = 'memberDisplay.cfm?memberID=';
  const baseFilename = base + memberId;
  const filename = path.join(__dirname, '..', 'HTML', baseFilename);
  return fs.existsSync(filename);
}

async function fetchMemberHTML(url) {
  const res = await fetch(url);
  return await res.text();
}

module.exports = { wasMemberHTMLFetched };
