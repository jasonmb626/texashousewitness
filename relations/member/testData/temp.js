const fs = require('fs');
const reps = require('./75reps-old.json');
const { getMemberIDFromMemberURL } = require('../dependencies');

const newReps = reps.map((rep) => {
  const newRep = {
    ...rep,
    member_id: getMemberIDFromMemberURL(rep.URL),
  };
  return newRep;
});
fs.writeFileSync('75reps.json', JSON.stringify(newReps));
