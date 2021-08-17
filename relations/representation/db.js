const getLegsWithNoRepresentation = function (pool) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      // console.log('Fetching rows with no representation');
      let res = await client.query(`
				SELECT s.leg as sleg, r.leg as rleg 
				FROM session AS s LEFT JOIN representation r on r.leg=s.leg and r.session=s.session 
				WHERE r.leg IS NULL ORDER BY s.leg;
			`);
      // console.log('Results:');
      // console.log(res.rows);
      const transformedResults = res.rows.map((row) => row.sleg);
      // console.log('Tranformed results:');
      // console.log(transformedResults);
      resolve(transformedResults);
    } catch (err) {
      reject(err);
    } finally {
      client.release();
    }
  });
};

const getLegWithNoRepresentation = function (pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const rows = await getLegsWithNoRepresentation(pool);
      resolve(rows[0]);
    } catch (err) {
      reject(err);
    }
  });
};

const getLatestLeg = function (pool) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      let res = await client.query(`
				SELECT MAX(leg) FROM session;
			`);
      resolve(res.rows[0].sleg);
    } catch (err) {
      reject(err);
    } finally {
      client.release();
    }
  });
};

const insertWork_RepresentationRecords = async function (pool, reps) {
  const insertPromises = [];
  reps.forEach((rep) => {
    insertPromises.push(insertWork_RepresentationRecord(pool, rep));
  });
  await Promise.all(insertPromises);
};

const insertWork_RepresentationRecord = async function (
  pool,
  { leg, scrapedName, URL, district, chamber, party, city, county }
) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      // console.log(
      //   `Inserting (${leg}, ${scrapedName}, ${URL}, ${district}, ${chamber}, ${party}, ${city}, ${county}) into w_representation.`
      // );
      await client.query(
        `
				INSERT INTO w_representation (leg, scraped_name, URL, district, chamber, party, city, county)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
			`,
        [leg, scrapedName, URL, district, chamber, party, city, county]
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
};

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

async function getUnprocessedRep(pool) {
  try {
    const reps = await getAllWorkReps(pool);
    reps.forEach((rep) => {});
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getAllLegs,
  getLegsWithNoRepresentation,
  getLegWithNoRepresentation,
  insertWork_RepresentationRecord,
  insertWork_RepresentationRecords,
  getAllWorkReps,
};
