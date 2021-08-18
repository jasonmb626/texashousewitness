const Context = require('../../../context');
const { insertWork_RepresentationRecords, getAllWorkReps } = require('../db');
const reps = require('../testData/75reps.json');
let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});
it('Inserts reps into work representation table', async () => {
  await insertWork_RepresentationRecords(context.pool, reps);
  const dbReps = await getAllWorkReps(context.pool);
  expect(dbReps).toBeDefined();
  expect(dbReps.length).toBe(185);
});
