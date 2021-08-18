function getUnprocessedMembersFromWorkReps(pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const unProcessedMember = await pool.query(
        'SELECT * FROM w_representation WHERE member_processed=false ORDER BY url;'
      );
      resolve(unProcessedMember.rows);
    } catch (err) {
      reject({});
    }
  });
}

async function insertMember(pool, member) {
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
  } catch (err) {
    console.error(err);
  }
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

module.exports = { getUnprocessedMembersFromWorkReps, insertMember };
