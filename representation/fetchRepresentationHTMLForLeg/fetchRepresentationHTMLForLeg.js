/*
 * This script finds either an empty leg, or else the most current leg and scrapes all its members
 * by making a post request to legislative reference library (https://lrl.texas.gov/legeLeaders/members/lrlhome.cfm)
 * for that legislature and inerts members into member table if necessary.
 */

const fs = require('fs');
const path = require('path');

const {
  getHTMLDataForLeg,
} = require('./fetchRepresentationHTMLForLeg.support');

const { pool } = require('../../db');

const { getLegWithNoRepresentation, getLatestLeg } = require('../db');

let force;

if (process.argv[3] == 'force') {
  force = true;
} else {
  force = false;
}
(async () => {
  console.log('Running fetchRepresentationHTMLForLeg.');
  let legToProcess;

  if (process.argv[2]) {
    console.log('Selecting leg based on commandline arg.');
    legToProcess = process.argv[2];
  } else {
    const emptyLeg = await getLegWithNoRepresentation();
    if (emptyLeg) {
      console.log('Selecting leg based on existence of empty leg.');
      legToProcess = emptyLeg;
    } else {
      console.log('Selecting latest leg.');
      legToProcess = await getLatestLeg();
    }
  }

  console.log(`Selected leg: ${legToProcess}`);
  console.log('Force? = ' + force);
  const filename = path.join('HTML', legToProcess + '.html');
  if (!fs.existsSync(filename) || force) {
    const html = await getHTMLDataForLeg(legToProcess);
    fs.writeFileSync(filename, html);
  } else {
    console.log(
      'Skipped fetch of representation data for leg: ' + legToProcess
    );
  }
})().finally(() => {
  pool.end();
  console.log('Ran fetchRepresentationHTMLForLeg.');
});
