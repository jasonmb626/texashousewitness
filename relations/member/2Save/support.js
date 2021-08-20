const fs = require('fs');
const path = require('path');

function shouldProcessMemberJSON(JSONFile, memberUTimes) {
  const basepath = path.join(__dirname, '..', 'JSON');
  const end = JSONFile.indexOf('.', basepath.length) - 1;
  const memberId = +JSONFile.substr(basepath.length + 1, end - basepath.length);
  const JSONMTime = new Date(fs.statSync(JSONFile).mtime);
  const memberUTime = new Date(
    memberUTimes.find((m) => m.member_id === memberId).update_dttm
  );
  return JSONMTime > memberUTime;
}

module.exports = { shouldProcessMemberJSON };
