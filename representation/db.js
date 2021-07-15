const pool = require('../dbPool');

const getLegsWithNoRepresentation = function() {
	return new Promise (async (resolve, reject) => {
		const client = await pool.connect();
		try {
			console.log('Fetching rows with no representation');
			let res = await client.query(`
				SELECT s.leg as sleg, r.leg as rleg 
				FROM session AS s LEFT JOIN representation r on r.leg=s.leg and r.session=s.session 
				WHERE r.leg IS NULL ORDER BY s.leg;
			`);
			console.log('Results:');
			console.log(res.rows);
			const transformedResults = res.rows.map(row => row.sleg);
			console.log('Tranformed results:');
			console.log(transformedResults);
			resolve(transformedResults);
		} catch (err) {
			reject(err);
		} finally {
			client.release();
		}
	});
}

const getLegWithNoRepresentation = function () {
	return new Promise (async (resolve, reject) => {
		try {
			const rows = await getLegsWithNoRepresentation();
			resolve(res.rows[0]);
		} catch (err) {
			reject(err);
		} finally {
			client.release();
		}
	});
}

const getLatestLeg = function () {
	return new Promise (async (resolve, reject) => {
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
}

const insertWork_RepresentationRecord = function (leg, scrapedName, URL, district, chamber, party, city, county) {
	return new Promise (async (resolve, reject) => {
		const client = await pool.connect();
		try {
			console.log(`Inserting (${leg}, ${scrapedName}, ${URL}, ${district}, ${chamber}, ${party}, ${city}, ${county}) into work.representation.`);
			await client.query(`
				INSERT INTO work.representation (leg, scraped_name, URL, district, chamber, party, city, county)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
			`, [leg, scrapedName, URL, district, chamber, party, city, county]);
			console.log(`Inserted (${leg}, ${scrapedName}, ${district}, ${chamber}, ${party}, ${city}, ${county}) into work.representation.`);
			resolve();
		} catch (err) {
			console.error (err);
			reject(err);
		} finally {
			client.release();
		}
	});
}

const get1UnprocessedLegHTMLFilename = function () {
	return new Promise (async (resolve, reject) => {
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
}

const getLatestLegHTMLFilename = function () {
	return new Promise (async (resolve, reject) => {
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
}

const getAllLegs = function () {
	return new Promise (async (resolve, reject) => {
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
}

module.exports = {
	pool,
	get1UnprocessedLegHTMLFilename,
	insertWork_RepresentationRecord,
	getLegWithNoRepresentation,
	getLatestLeg,
	getLegsWithNoRepresentation
}