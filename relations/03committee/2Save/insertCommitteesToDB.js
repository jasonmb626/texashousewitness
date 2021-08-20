const fs = require('fs');
const path = require('path');
const { pool } = require('../../../db');
const {
  setFileProcessedDTTM,
  wasFileUpdatedSinceLastProcessed,
} = require('../../support');
const { makeCommitteeInsertPromise } = require('./support');

const JSONDir = path.join(__dirname, '..', 'JSON');

const JSONFiles = fs.readdirSync(JSONDir);

const insertPromises = [];
(async () => {
  JSONFiles.forEach(async (JSONFileBase) => {
    const JSONFile = path.join(JSONDir, JSONFileBase);
    if (wasFileUpdatedSinceLastProcessed(pool, JSONFile)) {
      const committees = JSON.parse(fs.readFileSync(JSONFile).toString());
      committees.forEach((committee) => {
        insertPromises.push(
          makeCommitteeInsertPromise(pool, committee, async () => {
            await setFileProcessedDTTM(pool, JSONFileBase);
          })
        );
      });
    }
  });
  await Promise.all(insertPromises);
})().finally(() => pool.end());
