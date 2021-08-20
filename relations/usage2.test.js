const { rejects } = require('assert');
const fs = require('fs');

const Context = require('../context');
const {
  setFileProcessedDTTM,
  wasFileUpdatedSinceLastProcessed,
} = require('./support');

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // import and retain the original functionalities
  statSync: jest
    .fn()
    .mockReturnValue({ mtime: new Date(new Date().getTime() + 10000) }), // overwrite statSync
}));

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

describe('w_files functions', () => {
  it('Correctly sees file should be processed', async () => {
    await setFileProcessedDTTM(context.pool, 'asdfsda');
    const res = await wasFileUpdatedSinceLastProcessed(context.pool, 'asdfsda');
    expect(res).toBe(true);
  });
});
