const fs = require('fs');
const path = require('path');

const Context = require('../../../context');
const { makeMemberInsertPromise, getRepMemberIDsToProcess } = require('../db');
const { insertWork_RepresentationRecords } = require('../dependencies');
const { shouldProcessMemberHTML } = require('./support');

const repsMatch = require('../testData/75reps.json');
const missingRepsMatch = require('../testData/missingMember.json');

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
  await makeMemberInsertPromise(context.pool, memberMatch);
});
it('Correctly identifies member ids to be processed.', async () => {
  await insertWork_RepresentationRecords(context.pool, repsMatch);
  const reps = await getRepMemberIDsToProcess(context.pool);
  // const filename = path.join(__dirname, '..', 'testData', 'missingMember.json');
  // fs.writeFileSync(filename, JSON.stringify(reps));
  expect(reps).toEqual(missingRepsMatch);
});

it('Determine reprocess member if html file is newer than json file.', () => {
  const HTMLDir = path.join(__dirname, '..', 'HTML');
  const JSONDir = path.join(__dirname, '..', 'JSON');
  const memberHTMLFile = path.join(HTMLDir, 'memberDisplay.cfm?memberID=21');
  const memberJSONFile = path.join(JSONDir, '21.json');

  const shouldProcess = shouldProcessMemberHTML(memberHTMLFile, memberJSONFile);
  expect(shouldProcess).toBe(false);
});
