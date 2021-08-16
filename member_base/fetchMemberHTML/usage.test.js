const Context = require('../../tests/context');
const { getUnprocessedRep } = require('../../representation/db');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

it('Successfully identifies first rep whose member data has not been processed', async () => {
  getUnprocessedRep();
});
