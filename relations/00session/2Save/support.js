function makeSessionInsertPromise(pool, leg, session, year) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      let res = await client.query(
        `INSERT INTO session (leg, session, year) VALUES ($1, $2, $3) 
        RETURNING *;
        `,
        [leg, session, year]
      );
      resolve(res.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        resolve();
      }
      reject(err);
    } finally {
      client.release();
    }
  });
}

async function insertSessionsToDB(pool, sessions) {
  const insertPromises = [];
  sessions.forEach(({ leg, session, year }) => {
    insertPromises.push(makeSessionInsertPromise(pool, leg, session, year));
  });
  await Promise.all(insertPromises);
}

module.exports = {
  makeSessionInsertPromise,
  insertSessionsToDB,
};
