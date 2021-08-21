const fs = require('fs');
const path = require('path');

const { pool } = require('../../../db');
const {
  getUnprocessedMembersFromWorkReps,
  fetchMemberHTML,
} = require('./support');
const { getMemberIDFromMemberURL } = require('../dependencies');

(async () => {
  const missingReps = await getUnprocessedMembersFromWorkReps(pool);
  for (missingRep of missingReps) {
    const memberId = getMemberIDFromMemberURL(missingRep.url);
    if (memberId !== missingRep.member_id) {
      console.log('Missing rep id mismatch');
      console.log(missingRep);
    }
    const HTMLDir = path.join(__dirname, '..', 'HTML');
    const HTMLFile = path.join(HTMLDir, memberId + '.html');

    if (!fs.existsSync(HTMLFile)) {
      const url = 'https://lrl.texas.gov/legeLeaders/members/' + missingRep.url;
      console.log('Fetching ' + url);
      const html = await fetchMemberHTML(url);
      console.log('Fetched ' + url);
      fs.writeFileSync(HTMLFile, html);

      console.log('Waiting 10 seconds');
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 10000);
      });
      console.log('Waited 10 seconds');
    }
  }
})().then(() => pool.end());
