async function insertWork_RepresentationRecords(pool, reps) {
  const insertPromises = [];
  reps.forEach((rep) => {
    insertPromises.push(makeWorkRepInsertPromise(pool, rep));
  });
  await Promise.all(insertPromises);
}

async function makeWorkRepInsertPromise(
  pool,
  { leg, scrapedName, URL, memberId, district, chamber, party, city, county }
) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      // console.log(
      //   `Inserting (${leg}, ${scrapedName}, ${URL}, ${district}, ${chamber}, ${party}, ${city}, ${county}) into w_representation.`
      // );
      await client.query(
        `
				INSERT INTO w_representation (leg, scraped_name, URL, member_id, district, chamber, party, city, county)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
			`,
        [
          leg,
          scrapedName,
          URL,
          memberId,
          district,
          chamber,
          party,
          city,
          county,
        ]
      );
      // console.log(
      //   `Inserted (${leg}, ${scrapedName}, ${district}, ${chamber}, ${party}, ${city}, ${county}) into w_representation.`
      // );
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    } finally {
      client.release();
    }
  });
}

async function getAllLegs(pool) {
  try {
    const res = await pool.query(`
      SELECT distinct leg 
      FROM session
      ORDER BY leg;	
    `);
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getAllWorkReps(pool) {
  try {
    const res = await pool.query(`
      SELECT * FROM w_representation;
    `);
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  makeWorkRepInsertPromise,
  insertWork_RepresentationRecords,
  getAllWorkReps,
};
