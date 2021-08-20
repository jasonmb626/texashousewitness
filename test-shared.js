const { insertSessionsToDB } = require('./relations/00session/2Save/support');
const sessionsMatch = require('./relations/00session/testData/sessions.json');

async function insertSessions(pool) {
  await pool.query('DELETE FROM session');
  await insertSessionsToDB(pool, sessionsMatch);
}

module.exports = { insertSessions };
