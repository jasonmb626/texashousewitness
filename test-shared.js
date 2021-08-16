const { insertSessionsToDB } = require('./session/processSessionsHTML/support');
const sessionsMatch = require('./session/testData/sessions.json');

async function insertSessions(pool) {
  await pool.query('DELETE FROM session');
  await insertSessionsToDB(sessionsMatch, pool);
}

module.exports = { insertSessions };
