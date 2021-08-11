const { pool } = require('../db');

const {
  getSessionHTML,
  insertSessionsToDB,
  parseSessionHTML,
} = require('./fetchSessionsHelpers');

(async () => {
  try {
    const html = await getSessionHTML();
    const sessions = parseSessionHTML(html);
    await insertSessionsToDB(sessions, pool);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
