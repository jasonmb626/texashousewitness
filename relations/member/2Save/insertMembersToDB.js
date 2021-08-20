const fs = require('fs');
const path = require('path');
const { pool } = require('../../../db');
const { getMemberUpdateTimes } = require('../db');
const {
  shouldProcessMemberHTML,
  getMemberFileNameWMTimes,
  parseMemberHTML,
} = require('./support');

const HTMLDir = path.join(__dirname, '..', 'HTML');

const filenameWMTimes = getMemberFileNameWMTimes(HTMLDir);

(async () => {
  const dbUTimes = await getMemberUpdateTimes(pool);
  filenameWMTimes.forEach(async (filenameWMTime) => {
    if (shouldProcessMemberHTML(filenameWMTime, dbUTimes)) {
      const html = fs.readFileSync(filenameWMTime.filename);
      const member = parseMemberHTML(filenameWMTime.memberId, html);
      console.log(member);
      await insertMember(pool, member);
    }
  });
})().finally(() => pool.end());
