const path = require('path');

const { shouldProcessJSON } = require('../../support');

function shouldProcessMemberJSON(JSONFile, memberUTimes) {
  const basepath = path.join(__dirname, '..', 'JSON');
  const end = JSONFile.indexOf('.', basepath.length) - 1;
  const memberId = +JSONFile.substr(basepath.length + 1, end - basepath.length);
  const memberUTime = memberUTimes.find((m) => m.member_id === memberId)
    .update_dttm;
  return shouldProcessJSON(JSONFile, memberUTime);
}

async function makeMemberInsertPromise(pool, member) {
  return new Promise(async (resolve, reject) => {
    const surNamePromises = [];
    try {
      await pool.query(
        `
        INSERT INTO member_base (member_id, given_name, nick_name, update_dttm)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [member.memberId, member.givenName, member.nickName]
      );
      member.surNames.forEach((surNameObj) => {
        surNamePromises.push(
          insertSurname(
            pool,
            member.memberId,
            surNameObj.surName,
            surNameObj.current
          )
        );
      });
      await Promise.all(surNamePromises);
      resolve();
    } catch (err) {
      if (err.code === '23505') resolve(); //key already exists
      reject(err);
    }
  });
}

function insertSurname(pool, memberId, surName, current) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await pool.query(
        `
        INSERT INTO member_sur_name (member_id, sur_name, current)
        VALUES ($1, $2, $3) RETURNING *;
      `,
        [memberId, surName, current]
      );
      resolve(res);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

async function getMemberUpdateTimes(pool) {
  try {
    const res = await pool.query(`
      SELECT member_id, update_dttm
      FROM member;
    `);
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  shouldProcessMemberJSON,
  makeMemberInsertPromise,
  getMemberUpdateTimes,
};
