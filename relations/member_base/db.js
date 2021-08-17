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

module.exports = { getUnprocessedMembersFromWorkReps };
