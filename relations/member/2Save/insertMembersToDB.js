const fs = require('fs');
const path = require('path');
const { pool } = require('../../../db');
const { getMemberUpdateTimes, makeMemberInsertPromise } = require('../db');
const { shouldProcessMemberJSON } = require('./support');

const JSONDir = path.join(__dirname, '..', 'JSON');

const JSONFiles = fs.readdirSync(JSONDir);

const insertPromises = [];
(async () => {
  const dbUTimes = await getMemberUpdateTimes(pool);
  JSONFiles.forEach(async (JSONFile) => {
    const JSONFullPath = path.join(JSONDir, JSONFile);
    if (shouldProcessMemberJSON(JSONFullPath, dbUTimes)) {
      const member = JSON.parse(fs.readFileSync(JSONFullPath).toString());
      insertPromises.push(makeMemberInsertPromise(pool, member));
    }
  });
  await Promise.all(insertPromises);
})().finally(() => pool.end());
