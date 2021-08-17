const Context = require('../../../context');
const { getMissingMemberBaseFromWorkRep } = require('../db');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

it('Successfully identifies first rep whose member data has not been processed', async () => {
  getMissingMemberBaseFromWorkRep();
});
