const fs = require('fs');
const path = require('path');
const {
  processLegHTMLtoJSObj,
} = require('../../../representation/processLegHTMLHelpers');
const repsMatch = require('../representation/75reps.json');

it('Processes leg HTML file to JS Obj', async () => {
  const leg = 75;
  const filename = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'representation',
    'HTML',
    '75.html'
  );
  const html = fs.readFileSync(filename).toString();
  const reps = processLegHTMLtoJSObj(75, html);
  expect(reps).toStrictEqual(repsMatch);
});
