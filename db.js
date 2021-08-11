const { Pool } = require('pg');

function getDefaultDBConnObj() {
  return {
    host: process.env['PGHOST'],
    port: process.env['PGPORT'],
    user: process.env['PGUSER'],
    password: process.env['PGPASSWORD'],
    database: 'texashousewitness',
  };
}

const pool = new Pool(getDefaultDBConnObj());

module.exports = { pool, getDefaultDBConnObj };
