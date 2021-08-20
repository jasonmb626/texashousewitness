const Context = require('../context');
const { setFileProcessedDTTM } = require('./support');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

it('Correctly sets file update_dttm in DB', async () => {
  await setFileProcessedDTTM(context.pool, 'asdfsda');
  const res = await context.pool.query('SELECT * FROM w_file;');
  expect(res.rows.length).toBe(1);
  await setFileProcessedDTTM(context.pool, 'asdfsda');
  const res2 = await context.pool.query('SELECT * FROM w_file;');
  expect(res2.rows.length).toBe(1);
  const date1 = new Date(res.rows[0].processed_dttm);
  const date2 = new Date(res2.rows[0].processed_dttm);
  expect(date1 < date2).toBe(true);
});
