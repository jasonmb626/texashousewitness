const path = require('path');

const Context = require('../../../context');
const {
  shouldProcessMemberJSON,
  getMemberUpdateTimes,
  makeMemberInsertPromise,
} = require('./support');
const members = require('../testData/members.json');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});
it('Correctly identifies if member JSON file should be updated/inserted', async () => {
  const insertPromises = [];
  members.forEach((member) => {
    insertPromises.push(makeMemberInsertPromise(context.pool, member));
  });
  await Promise.all(insertPromises);
  const memberUTimes = await getMemberUpdateTimes(context.pool);
  const filename = path.join(__dirname, '..', 'JSON', '21.json');
  const shouldProcess = shouldProcessMemberJSON(filename, memberUTimes);
  expect(shouldProcess).toBe(false);
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
  await makeMemberInsertPromise(context.pool, memberMatch);
});
