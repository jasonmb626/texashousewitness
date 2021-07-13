/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.sql(`
			CREATE TABLE member (
				member_id int NOT NULL,
				given_name VARCHAR,
				sur_name VARCHAR,
				nick_name VARCHAR,
				full_name VARCHAR GENERATED ALWAYS AS (CASE WHEN nick_name = '' OR nick_name IS NULL THEN given_name || ' ' || sur_name ELSE given_name || ' "' || nick_name || '" ' || sur_name END) STORED,
				scraped_name VARCHAR NOT NULL,
				PRIMARY KEY (member_id)
			);
	`);
};

exports.down = pgm => {
	pgm.sql(`
		DROP TABLE member;
	`);
}