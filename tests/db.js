function getDBConnObj() {
  return {
    host: process.env['PGHOST'],
    port: process.env['PGPORT'],
    user: this.roleName,
    password: this.roleName,
    database: 'texashousewitness-test',
  };
}

module.exports = { getDBConnObj };
