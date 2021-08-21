async function makeCommitteeInsertPromise(pool, committee, cb) {
  return new Promise(async (resolve, reject) => {
    try {
      const { leg, chamber, code, name } = committee;
      await pool.query(
        `
        INSERT INTO committee (leg, chamber, code, name, update_dttm)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [leg, chamber, code, name]
      );
      await cb();
      resolve();
    } catch (err) {
      if (err.code === '23505') resolve(); //key already exists
      reject(err);
    }
  });
}

module.exports = { makeCommitteeInsertPromise };
