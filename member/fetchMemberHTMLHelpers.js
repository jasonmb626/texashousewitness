const fs = require('fs');
const path = require('path');

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
  const filename = path.join(__dirname, 'HTML', baseFilename);
  return fs.existsSync(filename);
}

module.exports = { getMemberIDFromMemberURL, wasMemberHTMLFetched };
