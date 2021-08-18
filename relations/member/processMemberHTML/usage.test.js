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
<<<<<<< HEAD

it('Correctly identifies member id to be processed.', async () => {});
=======
>>>>>>> f05a160a09e724934be2109a67f7104f34c87cb9
