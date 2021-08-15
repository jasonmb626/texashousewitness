const {
  getMemberIDFromMemberURL,
  wasMemberHTMLFetched,
} = require('./fetchMemberHTMLHelpers');
it('Correctly gets memberId from member URL', () => {
  const memberId = getMemberIDFromMemberURL(
    'memberDisplay.cfm?memberID=281&searchparams=chamber=~city=~countyID=0~RcountyID=~district=~first=~gender=~last=~leaderNote=~leg=75~party=~roleDesc=~Committee='
  );
  expect(memberId).toBe(281);
});
it('Correctly gets memberId from member URL - memberId last query param', () => {
  const memberId = getMemberIDFromMemberURL(
    'memberDisplay.cfm?searchparams=chamber=~city=~countyID=0~RcountyID=~district=~first=~gender=~last=~leaderNote=~leg=75~party=~roleDesc=~Committee=~memberID=282'
  );
  expect(memberId).toBe(282);
});

it('Correctly identifies member whose member HTML has been fetched', () => {
  const fetched = wasMemberHTMLFetched(281);
  expect(fetched).toBe(true);
});

it('Correctly identifies member whose member HTML has not been fetched', () => {
  const fetched = wasMemberHTMLFetched(50001);
  expect(fetched).toBe(false);
});
