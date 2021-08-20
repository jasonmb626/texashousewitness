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
  getUnprocessedMembersFromWorkReps,
  getRepMemberIDsToProcess,
};
