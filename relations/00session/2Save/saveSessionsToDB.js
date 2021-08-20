const sessions = require('../sessons.json');

const { pool } = require('../../db');
const { insertSessionsToDB } = require('../db');

(async () => {
  try {
    await insertSessionsToDB(pool, sessions);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
