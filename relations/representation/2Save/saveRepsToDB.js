const reps = require('../reps.json');

const { pool } = require('../../../db');

const { makeWorkRepInsertPromise } = require('../db');

(async () => {
  try {
    console.log('Calling Promise.all to insert all records');
    const dbInserts = reps.map((rep) => makeWorkRepInsertPromise(pool, rep));
    await Promise.all(dbInserts);
    console.log('Called Promise.all to insert all records');
  } catch (err) {
    console.error(err);
  }
})().finally(() => pool.end());
