const { pool } = require('../db');
const { getSessionHTML } = require('./fetchSessions/support');
const {
  parseSessionHTML,
  insertSessionsToDB,
} = require('./processSessionsHTML/support');

async function fetchSessions() {
  console.log('Fetching Sessions');
  try {
    const html = await getSessionHTML();
    const sessions = parseSessionHTML(html);
    await insertSessionsToDB(sessions, pool);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

fetchSessions();
