const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

function getMemberIDFromMemberURL(url) {
  const searchStr = 'memberID=';
  const start = url.indexOf(searchStr) + searchStr.length;
  let end = url.indexOf('&', start);
  if (end === -1) end = url.length;
  const memberId = +url.slice(start, end);
  return memberId;
}

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

module.exports = { getMemberIDFromMemberURL, wasMemberHTMLFetched };
