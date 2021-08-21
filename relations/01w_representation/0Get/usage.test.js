const Context = require('../../../context');

const { insertSessions } = require('../../../test-shared');

const { getLegWithNoRepresentation } = require('./support');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});
it('Retreives earliest session with no representation', async () => {
  await insertSessions(context.pool);
  const session = await getLegWithNoRepresentation(context.pool);
  expect(session).toBe(75);
});
