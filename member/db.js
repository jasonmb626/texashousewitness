const pool = require('../dbPool');



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

module.exports = {
	getLegWithNoMembers,
	insertMemberHTMLFile,
	get1UnprocessedLegHTML,
}