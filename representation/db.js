const pool = require('../dbPool');

const insertWork_RepresentationRecord = function (scrapedName, district, chamber, party, city, county) {
	return new Promise (async (resolve, reject) => {
		const client = await pool.connect();
		try {
			let res = await client.query(`
				INSERT INTO work.representation (scraped_name, district, chamber, party, city, county)
				VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
			`, [scrapedName, district, chamber, party, city, county]);
			resolve(res.rows[0]);
		} catch (err) {
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
module.exports = {
	get1UnprocessedLegHTML,
	insertWork_RepresentationRecord
}