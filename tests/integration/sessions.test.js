const Context = require('../context');

const { insertSessions } = require('./shared');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

it('Inserts sessions into database', async () => {
  await insertSessions(context);
  const res = await context.pool.query('SELECT COUNT(*) FROM session');
  expect(res.rows[0].count).toBe('28');
});
