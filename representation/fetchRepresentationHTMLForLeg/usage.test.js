const Context = require('../../context');
const { insertWork_RepresentationRecords } = require('../db');
const reps = require('../testData/75reps.json');
const { insertSessions } = require('../../test-shared');

const { getLegWithNoRepresentation, getAllWorkReps } = require('../db');

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

it('Inserts reps into work representation table', async () => {
  await insertWork_RepresentationRecords(context.pool, reps);
  const dbReps = await getAllWorkReps(context.pool);
  expect(dbReps).toBeDefined();
  expect(dbReps.length).toBe(185);
});
