const pool = require('../dbPool');

const getLegWithNoMembers = function () {
	return new Promise (async (resolve, reject) => {
		const client = await pool.connect();
		try {
			let res = await client.query(`SELECT s.leg as sleg, r.leg as rleg 
				FROM session AS s LEFT JOIN representation r on r.leg=s.leg and r.session=s.session 
				WHERE r.leg IS NULL ORDER BY s.leg LIMIT 1;`);
			resolve(res.rows[0].sleg);
		} catch (err) {
			reject(err);
		} finally {
			client.release();
		}
	});
}

const insertMemberHTMLFile = function (leg, filename) {
	return new Promise (async (resolve, reject) => {
		const client = await pool.connect();
		try {
			let res = await client.query(`
				INSERT INTO members_html_files (leg, filename)
				VALUES ($1, $2) RETURNING *;
			`, [leg, filename]);
			resolve(res.rows[0]);
		} catch (err) {
			reject(err);
		} finally {
			client.release();
		}
	});
}

const get1UnprocessedLegHTML = function () {
	return new Promise (async (resolve, reject) => {
		const client = await pool.connect();
		try {
			let res = await client.query(`
				SELECT filename FROM members_html_files
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

module.exports = {
	getLegWithNoMembers,
	insertMemberHTMLFile,
	get1UnprocessedLegHTML
}