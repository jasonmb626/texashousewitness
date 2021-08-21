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
  const headers = {
    Host: 'lrl.texas.gov',
    'User-Agent':
      'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    Cookie:
      'CFID=55698242; CFTOKEN=89326082; JSESSIONID=EF09DD436D19599D6EE8F0CDFD1B542A.cfusion',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
  };
  const res = await fetch(url, {
    headers,
  });
  return await res.text();
}

async function getUnprocessedMembersFromWorkReps(pool) {
  try {
    const unProcessedMember = await pool.query(
      'SELECT * FROM w_representation WHERE member_processed=false ORDER BY url;'
    );
    return unProcessedMember.rows;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  wasMemberHTMLFetched,
  fetchMemberHTML,
  getUnprocessedMembersFromWorkReps,
};
