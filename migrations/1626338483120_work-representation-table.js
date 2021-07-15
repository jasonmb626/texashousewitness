/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.sql(`
		CREATE TABLE work.representation(
			leg SMALLINT NOT NULL,
			scraped_name VARCHAR NOT NULL,
			url VARCHAR NOT NULL,
			district SMALLINT NOT NULL,
			chamber CHAR(1) NOT NULL,
			party CHAR(1) NOT NULL,
			city VARCHAR NOT NULL,
			county VARCHAR NOT NULL
		);
	`);
};

exports.down = pgm => {
	pgm.sql(`
		DROP TABLE work.representation;
	`);
};
