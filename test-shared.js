const { insertSessionsToDB } = require('./relations/session/db');
const sessionsMatch = require('./relations/session/testData/sessions.json');

async function insertSessions(pool) {
  await pool.query('DELETE FROM session');
  await insertSessionsToDB(pool, sessionsMatch);
}

module.exports = { insertSessions };
