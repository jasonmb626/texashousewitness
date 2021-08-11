/*
 * This script loops through each session from 75 (the first session with reliable data
 * to (86). Makes a post request to Texas Legislatrure online by session & writes
 * out the html document to 75.html, 76.html etc. by legislature.
 *
 * HTML contains committee names and links to obtain HTML that has all committee meetings
 * for that committee.
 *
 * Parsing of those docs done elsewhere.
 *
 */
const fs = require('fs');
const fetch = require('node-fetch');
const jsdom = require('jsdom');

const { insertSession } = require('./db');

const { JSDOM } = jsdom;

let pool = null;

async function getSessionHTML() {
  const res = await fetch('https://capitol.texas.gov');
  return await res.text();
}

function parseSessionHTML(html) {
  const sessions = [];
  const dom = new JSDOM(html).window.document;
  const cboLegSess = dom.getElementById('cboLegSess');
  const options = cboLegSess.getElementsByTagName('option');
  Array.from(options).forEach(async (option) => {
    const textContent = option.textContent;
    const leg = textContent.slice(0, 2);
    const session = textContent.slice(3, 4);
    const year = textContent.slice(-4);
    if (leg >= 75)
      //The data before 75th is unreliable or missing
      sessions.push({ leg, session, year });
  });
  return sessions;
}

async function insertSessionsToDB(sessions, pool) {
  const insertPromises = [];
  sessions.forEach(({ leg, session, year }) => {
    insertPromises.push(insertSession(pool, leg, session, year));
  });
  await Promise.all(insertPromises);
}

module.exports = { insertSessionsToDB, getSessionHTML, parseSessionHTML };