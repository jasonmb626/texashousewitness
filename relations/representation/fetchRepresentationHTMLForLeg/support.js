const fetch = require('node-fetch');

async function getHTMLDataForLeg(legToProcess) {
  const headers = {
    //headers copied from browser "raw" data. Below vim macro used to turn it into js-compatible header object
    //^i't:a'wi'g_a',j
    Host: 'lrl.texas.gov',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Referer: 'https://lrl.texas.gov/legeLeaders/members/lrlhome.cfm',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': '113',
    Origin: 'https://lrl.texas.gov',
    Connection: 'keep-alive',
    Cookie:
      'CFID=40198225; CFTOKEN=85756896; JSESSIONID=DD7183B6D5148B33B15E5F5561A8F3EF.cfusion',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
  };
  //The "form" data, only searching by leg
  const form = {
    last: '',
    first: '',
    gender: '',
    leg: legToProcess,
    chamber: '',
    district: '',
    party: '',
    leaderNote: '',
    committee: '',
    roleDesc: '',
    countyID: '',
    city: '',
    RcountyID: '',
  };

  try {
    const res = await fetch(
      'https://lrl.texas.gov/legeLeaders/members/membersearch.cfm',
      {
        method: 'POST',
        headers,
        body: new URLSearchParams(form),
      }
    );
    console.log('Feched representation data for leg: ' + legToProcess);
    return await res.text();
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = { getHTMLDataForLeg };