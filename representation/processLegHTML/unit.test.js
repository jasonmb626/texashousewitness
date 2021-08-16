const fs = require('fs');
const path = require('path');
const { processLegHTMLtoJSObj } = require('./support');
const repsMatch = require('../testData/75reps.json');

it('Processes leg HTML file to JS Obj', async () => {
  const leg = 75;
  const filename = path.join(__dirname, '..', 'HTML', `${leg}.html`);
  const html = fs.readFileSync(filename).toString();
  const reps = processLegHTMLtoJSObj(leg, html);
  expect(reps).toStrictEqual(repsMatch);
});
