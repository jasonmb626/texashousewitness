/*
 * This script finds either an empty leg, or else the most current leg and scrapes all its members
 * by making a post request to legislative reference library (https://lrl.texas.gov/legeLeaders/members/lrlhome.cfm)
 * for that legislature and inerts members into member table if necessary.
 */

const fs = require('fs');
const path = require('path');

const { getRepHTMLDataForLeg } = require('./support');

const { pool } = require('../../../db');

const { getLegsWithNoRepresentation } = require('./support');

let force;

(async () => {
  console.log('Running fetchRepresentationHTMLForLeg.');
  const legsToProcess = await getLegsWithNoRepresentation(pool);

  legsToProcess.forEach(async (legToProcess) => {
    const filename = path.join(__dirname, '..', 'HTML', legToProcess + '.html');
    if (!fs.existsSync(filename) || force) {
      const html = await getRepHTMLDataForLeg(legToProcess);
      fs.writeFileSync(filename, html);
    } else {
      console.log(
        'Skipped fetch of representation data for leg: ' + legToProcess
      );
    }
  });
})().finally(() => pool.end());
