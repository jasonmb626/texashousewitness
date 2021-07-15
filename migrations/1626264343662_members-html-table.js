/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.sql(`
		CREATE TABLE work.leg_html_files (
			leg SMALLINT NOT NULL,
			filename VARCHAR NOT NULL,
			processed BOOL DEFAULT false NOT NULL,
			PRIMARY KEY (leg, filename)
		);
	`);
};

exports.down = pgm => {
	pgm.sql(`
		DROP TABLE work.leg_html_files;
	`);
};
