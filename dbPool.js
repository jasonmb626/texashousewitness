const { Pool } = require("pg");

const pool = new Pool({
  // If you've set environment variables host/port/user/password etc is not needed
  database: 'texashousewitness'
});

module.exports = pool;