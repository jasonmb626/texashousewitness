const fs = require('fs');
const path = require('path');
const { pool } = require('../../../db');
const {
  wasFileUpdatedSinceLastProcessed,
  setFileProcessedDTTM,
} = require('../../support');
const { makeMemberInsertPromise } = require('./support');

const JSONDir = path.join(__dirname, '..', 'JSON');

const JSONFiles = fs.readdirSync(JSONDir);

const insertPromises = [];
(async () => {
  JSONFiles.forEach(async (JSONFileBase) => {
    const JSONFile = path.join(JSONDir, JSONFileBase);
    if (await wasFileUpdatedSinceLastProcessed(pool, JSONFile)) {
      const member = JSON.parse(fs.readFileSync(JSONFile).toString());
      insertPromises.push(
        makeMemberInsertPromise(pool, member, async () => {
          await setFileProcessedDTTM(pool, JSONFile);
        })
      );
    }
  });
  try {
    await Promise.all(insertPromises);
  } catch (err) {
    console.error(err);
  }
})().finally(async () => {
  try {
    await pool.end();
  } catch (err) {
    console.error(err);
  }
});
