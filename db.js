function getDefaultDBConnObj() {
  return {
    host: process.env['PGHOST'],
    port: process.env['PGPORT'],
    user: process.env['PGUSER'],
    password: process.env['PGPASSWORD'],
    database: 'texashousewitness',
  };
}

module.exports = { getDefaultDBConnObj };
