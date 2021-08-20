const { getSessionHTML } = require('./support');

const { getHTMLDataForLeg } = require('../../representation/0Get/support');

it.skip('Fetches HTML data for given legislature', async () => {
  const html = await getHTMLDataForLeg(75);
  // const filename = path.join(__dirname, '75.html');
  // fs.writeFileSync('75.html', html);
});
it('Downloads session HTML', async () => {
  const html = await getSessionHTML();
  expect(html).toMatch(/Search Legislation/);
  expect(html).toMatch(/<option value="/i);
});
