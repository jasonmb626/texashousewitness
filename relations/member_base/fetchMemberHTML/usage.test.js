const Context = require('../../../context');
const { getUnprocessedMembersFromWorkReps } = require('../db');
const { insertWork_RepresentationRecords } = require('./testDependencies');
const { fetchMemberHTML } = require('./support');
const reps = require('../testData/75reps.json');

let context = null;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(async () => {
  return context.end();
});

it('Successfully identifies first rep whose member data has not been processed', async () => {
  const matchData = {
    leg: 75,
    scraped_name: 'Dennis Bonnen',
    url:
      'memberDisplay.cfm?memberID=101&searchparams=chamber=~city=~countyID=0~RcountyID=~district=~first=~gender=~last=~leaderNote=~leg=75~party=~roleDesc=~Committee=',
    district: 25,
    chamber: 'H',
    party: 'R',
    city: 'Angleton',
    county: 'Brazoria',
    member_processed: false,
    rep_processed: false,
  };
  await insertWork_RepresentationRecords(context.pool, reps);
  const res = await getUnprocessedMembersFromWorkReps(context.pool);
  expect(res[0]).toStrictEqual(matchData);
});
