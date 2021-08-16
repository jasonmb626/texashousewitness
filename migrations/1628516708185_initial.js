/* eslint-disable camelcase */

exports.shorthands = undefined;

//full_name VARCHAR GENERATED ALWAYS AS (CASE WHEN nick_name = '' OR nick_name IS NULL THEN given_name || ' ' || sur_name ELSE given_name || ' "' || nick_name || '" ' || sur_name END) STORED,

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE member_base (
    member_id int NOT NULL,
    given_name VARCHAR,
    nick_name VARCHAR,
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
      sur_name VARCHAR NOT NULL,      
      district SMALLINT NOT NULL, party CHAR(1) NOT NULL,
      city VARCHAR NOT NULL,
      county VARCHAR NOT NULL,
      UNIQUE (leg, session, sur_name),
      FOREIGN KEY (leg, session) REFERENCES session(leg, session),
      FOREIGN KEY (member_id) REFERENCES member_base(member_id)
    );
        
    CREATE TABLE w_representation(
      leg SMALLINT NOT NULL,
      scraped_name VARCHAR NOT NULL,
      url VARCHAR NOT NULL,
      district SMALLINT NOT NULL,
      chamber CHAR(1) NOT NULL,
      party CHAR(1) NOT NULL,
      city VARCHAR NOT NULL,
      county VARCHAR NOT NULL,
      member_processed BOOLEAN NOT NULL DEFAULT false,
      rep_processed BOOLEAN NOT NULL DEFAULT false,
      PRIMARY KEY (leg, scraped_name, url, district, chamber, party, city, county)
    );
          
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE member_base;
    DROP TABLE session;
    DROP TABLE representation;
    DROP TABLE w_representation;
  `);
};
