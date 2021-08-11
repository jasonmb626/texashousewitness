const fs = require('fs');
const path = require('path');

const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const {
  pool,
  getLegsWithNoRepresentation,
  insertWork_RepresentationRecord,
} = require('./db');

function processLegHTMLtoJSObj(leg, html) {
  const reps = [];
  const dom = new JSDOM(html).window.document;
  const table = dom.querySelector('#tableToSort');
  const rows = table.getElementsByTagName('tr');
  Array.from(rows).forEach((row, index) => {
    if (index > 0) {
      const columns = row.getElementsByTagName('td');
      const scrapedName = columns[0].children[0].textContent;
      const URL = columns[0].children[0].getAttribute('href');
      const district = columns[2].textContent.trim();
      const chambers = columns[3].textContent.trim();
      const legislatures = columns[5].textContent.trim();
      const parties = columns[6].textContent.trim();
      const city = columns[7].textContent.trim();
      const county = columns[8].textContent.trim();
      const index = decodeLegislatures(legislatures).findIndex(
        (l) => l.start <= leg && l.end >= leg
      );
      const chamber = chambers.split('\n')[index].trim();
      const party = parties.split('\n')[index].trim();
      reps.push({
        leg,
        scrapedName,
        URL,
        district,
        chamber,
        party,
        city,
        county,
      });
    }
  });
  return reps;
}

function decodeLegislatures(instr) {
  const legislatureRanges = instr.split('\t');
  const legislatures = [];
  legislatureRanges.forEach((range) => {
    if (range != '') {
      const legislaturesStr = range.trim().split('\n');
      const start = parseInt(legislaturesStr[0].trim().slice(0, 2));
      const ends = legislaturesStr[legislaturesStr.length - 1]
        .trim()
        .split('-');
      const end = parseInt(ends[ends.length - 1].trim().slice(0, 2));
      legislatures.push({ start, end });
    }
  });
  return legislatures;
}

module.exports = { processLegHTMLtoJSObj, decodeLegislatures };
