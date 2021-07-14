/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.sql(`
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
	`);
};

exports.down = pgm => {
	pgm.sql(`
		DROP TABLE representation;
	`);
};
