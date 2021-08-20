async function getCommitteeUpdateTimes(pool) {
  try {
    const res = await pool.query(`
      SELECT leg, chamber, code, update_dttm
      FROM committee;
    `);
    return res.rows;
  } catch (err) {
    console.error(err);
  }
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

async function getRepMemberIDsToProcess(pool) {
  try {
    const res = await pool.query(`
    SELECT a.member_id missing, b.member_id
    FROM w_representation a LEFT JOIN member b ON b.member_id = a.member_id
    WHERE b.member_id IS NULL
    ORDER BY missing;
  `);
    return res.rows.map((row) => row.missing);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getCommitteeUpdateTimes,
  getUnprocessedMembersFromWorkReps,
  makeMemberInsertPromise,
  getRepMemberIDsToProcess,
};
