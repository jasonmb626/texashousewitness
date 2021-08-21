const fs = require('fs');
const path = require('path');

const { pool } = require('../../../db');

const { makeWorkRepInsertPromise } = require('./support');

const {
  wasFileUpdatedSinceLastProcessed,
  setFileProcessedDTTM,
} = require('../../support');

const JSONDir = path.join(__dirname, '..', 'JSON');
const JSONFiles = fs.readdirSync(JSONDir);

(async () => {
  JSONFiles.forEach(async (JSONFile) => {
    const filename = path.join(JSONDir, JSONFile);
    try {
      if (await wasFileUpdatedSinceLastProcessed(pool, filename)) {
        console.log('Processing ' + filename);
        const reps = JSON.parse(fs.readFileSync(filename).toString());
        const dbInserts = reps.map((rep) =>
          makeWorkRepInsertPromise(pool, rep, async () => {
            await setFileProcessedDTTM(pool, filename);
          })
        );
        await Promise.all(dbInserts);
      }
    } catch (err) {
      console.error(err);
    }
  });
})().finally(async () => await pool.end());
