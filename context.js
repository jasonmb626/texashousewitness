const { Pool } = require('pg');
const { randomBytes } = require('crypto');
const format = require('pg-format');
const { getDefaultDBConnObj } = require('./db');
const { default: migrate } = require('node-pg-migrate');

const DEFAULT_OPTS = getDefaultDBConnObj();

const ROOT_OPTS = {
  ...DEFAULT_OPTS,
  database: 'texashousewitness-test',
};

class Context {
  pool = null;
  roleName = null;

  static async build() {
    const roleName = 'a' + randomBytes(4).toString('hex');
    let pool = new Pool(ROOT_OPTS);

    await pool.query(
      format('CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName)
    );

    await pool.query(
      format('CREATE SCHEMA %I AUTHORIZATION %I;', roleName, roleName)
    );

    await pool.end();

    const ROLE_OPTS = {
      host: process.env['PGHOST'],
      port: process.env['PGPORT'],
      user: roleName,
      password: roleName,
      database: 'texashousewitness-test',
    };

    await migrate({
      schema: roleName,
      direction: 'up',
      log: () => {},
      noLock: true,
      dir: 'migrations',
      databaseUrl: ROLE_OPTS,
    });

    pool = new Pool(ROLE_OPTS);

    return new Context(roleName, pool);
  }

  constructor(roleName, pool) {
    this.roleName = roleName;
    this.pool = pool;
  }

  async end() {
    await this.pool.end();

    const rootPool = new Pool(ROOT_OPTS);

    // Delete the role and schema we created
    await rootPool.query(format('DROP SCHEMA %I CASCADE;', this.roleName));
    await rootPool.query(format('DROP ROLE %I;', this.roleName));

    // Disconnect
    await rootPool.end();
  }
}

module.exports = Context;
