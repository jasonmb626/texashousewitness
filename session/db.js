const pool = require('../dbPool');

const insertSession = function (leg, session, year) {
	return new Promise (async (resolve, reject) => {
		const client = await pool.connect();
		try {
			let res = await client.query("INSERT INTO session (leg, session, year) VALUES ($1, $2, $3) returning *",
			[leg, session, year]);
			resolve(res.rows[0]);
		} catch (err) {
			reject(err);
		} finally {
			client.release();
		}
	});
}

module.exports = {
	insertSession
}