const fs = require('fs');
const path = require('path');

const { pool } = require('../../../db');
const { insertSessionsToDB } = require('./support');
const {
  wasFileUpdatedSinceLastProcessed,
  setFileProcessedDTTM,
} = require('../../support');

const filename = path.join(__dirname, '..', 'sessions.json');

(async () => {
  await pool.query('SELECT 1+1;');
  if (await wasFileUpdatedSinceLastProcessed(pool, filename)) {
    try {
      const sessions = JSON.parse(fs.readFileSync(filename).toString());
      await insertSessionsToDB(pool, sessions);
      await setFileProcessedDTTM(pool, filename);
    } catch (err) {
      console.error(err);
    } finally {
      await pool.end();
    }
  }
})().finally(async () => await pool.end());
