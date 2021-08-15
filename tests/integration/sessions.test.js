const Context = require('../context');

const { insertSessionsToDB } = require('../../session/fetchSessionsHelpers');
const { getLegWithNoRepresentation } = require('../../representation/db');
const sessionsMatch = require('../../session/sessions.json');

let client = null;
let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

beforeEach(async () => {
  client = await context.pool.connect();
});

afterEach(async () => {
  return client.release();
});

async function insertSessions() {
  await client.query('DELETE FROM session');
  await insertSessionsToDB(sessionsMatch, context.pool);
}
it('Inserts sessions into database', async () => {
  await insertSessions();
  const res = await client.query('SELECT COUNT(*) FROM session');
  expect(res.rows[0].count).toBe('28');
});

it('Retreives earliest session with no representation', async () => {
  await insertSessions();
  const session = await getLegWithNoRepresentation(context.pool);
  expect(session).toBe(75);
});
