const Context = require('../../../context');
const { insertMember } = require('../db');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});
it('Correctly inserts member into database', async () => {
  const memberMatch = {
    memberId: 243,
    givenName: 'Senfronia',
    nickName: '',
    surNames: [
      { surName: 'Thompson', current: true },
      { surName: 'Carrington', current: false },
      { surName: 'Paige', current: false },
    ],
  };
  await insertMember(context.pool, memberMatch);
});
