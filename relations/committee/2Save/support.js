const { shouldProcessJSON } = require('../../support');

function shouldProcessCommitteeJSON(JSONFile, committeeUTimes) {
  const basepath = path.join(__dirname, '..', 'JSON');
  const JSONFileBase = JSONFile.replace(basepath, '');
  let start = 0;
  let end = JSONFileBase.indexOf('_', start);
  const memberId = +JSONFile.substr(basepath.length + 1, end - basepath.length);
  const memberUTime = memberUTimes.find((m) => m.member_id === memberId)
    .update_dttm;
  return shouldProcessJSON(JSONFile, memberUTime);
}
