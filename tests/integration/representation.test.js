const Context = require('../context');
const { insertWork_RepresentationRecords } = require('../../representation/db');
const reps = require('../unit/representation/75reps.json');

let client = null;
let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

beforeEach(async () => {
  client = await context.pool.connect();
});

afterEach(async () => {
  return client.release();
});

it('Inserts reps into work representation table', async () => {
  await insertWork_RepresentationRecords(context.pool, reps);
  const client = await context.pool.connect();
  const res = await client.query(`
    SELECT COUNT(*) FROM w_representation
  `);
  expect(res.rows[0].count).toBe('185');
  await client.release();
});
