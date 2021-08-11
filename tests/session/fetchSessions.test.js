const fs = require('fs');
const path = require('path');
const sessionsMatch = require('./sessions.json');
const { Pool } = require('pg');

const Context = require('../context');
const {
  getSessionHTML,
  parseSessionHTML,
  insertSessionsToDB,
} = require('../../session/fetchSessionsHelpers');

let client = null;
let context = null;

function getDBConnObj() {
  return {
    host: process.env['PGHOST'],
    port: process.env['PGPORT'],
    user: this.roleName,
    password: this.roleName,
    database: 'texashousewitness-test',
  };
}

it('Downloads session HTML', async () => {
  const html = await getSessionHTML();
  expect(html).toMatch(/Search Legislation/);
  expect(html).toMatch(/<option value="/i);
});

it('Processes session HTML to JS Obj', () => {
  const filename = path.join(__dirname, 'index.html');
  const html = fs.readFileSync(filename).toString();
  const sessions = parseSessionHTML(html);
  expect(sessions).toStrictEqual(sessionsMatch);
});

it('Inserts sessions into database', async () => {
  try {
    context = await Context.build();
    client = await context.pool.connect();
    await client.query('DELETE FROM session');
    await insertSessionsToDB(sessionsMatch, context.pool);
    const res = await client.query('SELECT COUNT(*) FROM session');
    expect(res.rows[0].count).toBe(28);
  } finally {
    await client.release();
    return context.end();
  }
});
