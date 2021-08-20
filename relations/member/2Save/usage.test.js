const path = require('path');

const Context = require('../../../context');
const { shouldProcessMemberJSON } = require('./support');
const { getMemberUpdateTimes, makeMemberInsertPromise } = require('../db');
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
