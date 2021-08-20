const fs = require('fs');
const path = require('path');

const { pool } = require('../../../db');

const { makeWorkRepInsertPromise } = require('./support');

const {
  wasFileUpdatedSinceLastProcessed,
  setFileProcessedDTTM,
} = require('../../support');

const filename = path.join(__dirname, '..', 'reps.json');

(async () => {
  try {
    if (await wasFileUpdatedSinceLastProcessed(pool, filename)) {
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
})().finally(async () => await pool.end());
