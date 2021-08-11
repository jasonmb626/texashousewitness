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

const get1UnprocessedLegHTMLFilename = function (pool) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      let res = await client.query(`
				SELECT filename FROM work.leg_html_files
				WHERE processed=false LIMIT 1;
			`);
      resolve(res.rows[0].filename);
    } catch (err) {
      reject(err);
    } finally {
      client.release();
    }
  });
};

const getLatestLegHTMLFilename = function (pool) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      let res = await client.query(`
				SELECT filename FROM work.leg_html_files
				WHERE leg = (SELECT MAX leg FROM work.leg_html_files);
			`);
      resolve(res.rows[0].filename);
    } catch (err) {
      reject(err);
    } finally {
      client.release();
    }
  });
};

const getAllLegs = function (pool) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    try {
      let res = await client.query(`
				SELECT distinct leg 
				FROM session
				ORDER BY leg;	
			`);
      resolve(res.rows);
    } catch (err) {
      reject(err);
    } finally {
      client.release();
    }
  });
};

module.exports = {
  get1UnprocessedLegHTMLFilename,
  insertWork_RepresentationRecords,
  getLegWithNoRepresentation,
  getLatestLeg,
  getLegsWithNoRepresentation,
};
