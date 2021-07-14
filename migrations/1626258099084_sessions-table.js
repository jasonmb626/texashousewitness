/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.sql(`
		CREATE TABLE session (
			leg SMALLINT NOT NULL,
			session CHAR(1) NOT NULL,
			year SMALLINT NOT NULL,
			PRIMARY KEY (leg, session)
		);
	`);
};

exports.down = pgm => {
	pgm.sql(`
		DROP TABLE session;
	`);
};
