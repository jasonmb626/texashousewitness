const { Pool } = require("pg");

const pool = new Pool({
  // If you've set environment variables this is not needed
  // const connectionString = 'postgresql://app:123456@localhost:5432/project_name'
});

module.exports = pool;