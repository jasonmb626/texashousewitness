const { insertSessionsToDB } = require('../../session/fetchSessionsHelpers');
const sessionsMatch = require('../../session/sessions.json');

async function insertSessions(context) {
  await context.pool.query('DELETE FROM session');
  await insertSessionsToDB(sessionsMatch, context.pool);
}

module.exports = { insertSessions };
