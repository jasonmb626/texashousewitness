const pool = require('../dbPool');

const client = await pool.connect();
try {
	client.query(`
		CREATE TABLE member (
			member_id int NOT NULL,
			given_name VARCHAR,
			sur_name VARCHAR,
			nick_name VARCHAR,
			full_name VARCHAR GENERATED ALWAYS AS (CASE WHEN nick_name = '' OR nick_name IS NULL THEN given_name || ' ' || sur_name ELSE given_name || ' "' || nick_name || '" ' || sur_name END) STORED,
			scraped_name VARCHAR NOT NULL,
			PRIMARY KEY (member_id)
		);

		CREATE TABLE session (
			leg SMALLINT NOT NULL,
			session CHAR(1) NOT NULL,
			year SMALLINT NOT NULL,
			PRIMARY KEY (leg, session)
		);

		CREATE TABLE representation (
			leg SMALLINT NOT NULL,
			session CHAR(1) NOT NULL, 
			member_id SMALLINT NOT NULL, 
			district SMALLINT NOT NULL,
			party CHAR(1) NOT NULL,
			city VARCHAR NOT NULL,
			county VARCHAR NOT NULL,
			FOREIGN KEY (leg, session) REFERENCES session(leg, session),
			FOREIGN KEY (member_id) REFERENCES member(member_id)
		);

		CREATE TABLE work.representation(
			leg SMALLINT NOT NULL,
			scraped_name VARCHAR NOT NULL,
			url VARCHAR NOT NULL,
			district SMALLINT NOT NULL,
			chamber CHAR(1) NOT NULL,
			party CHAR(1) NOT NULL,
			city VARCHAR NOT NULL,
			county VARCHAR NOT NULL
			
			CREATE TABLE work.leg_html_files (
				leg SMALLINT NOT NULL,
				filename VARCHAR NOT NULL,
				processed BOOL DEFAULT false NOT NULL,
				PRIMARY KEY (leg, filename)
			);
		);
	`).then(() => console.log('Created tables'));
} catch (err) {
	console.error(err);
} finally {
	client.release();
	pool.end();
}
