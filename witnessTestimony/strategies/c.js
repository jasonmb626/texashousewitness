const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
  scrape: function (html, meeting_cd) {
    const dom = new JSDOM(html).window.document;
    let page = 1;

    let searchStr;
    let startIndex = -1;
    let endIndex = -1;

    const records = [];

    let bill_name = '';
    let bill_cd = '';
    let session = '';
    let position = '';
    let self = false;
    let rbnt = false;
    let committee = '';
    let dttm = '';

    const Ps = dom.getElementsByTagName('p');
    Array.from(Ps).forEach((p, i) => {
      const sp = p.querySelector('span');
      if (i === 0) {
        // do nothing
      } else if (i === 1) {
        committee = sp.textContent
          .replace(new RegExp(String.fromCharCode(65533), 'g'), '')
          .replace('\n', ' ')
          .trim();
      } else if (i === 2) {
        dttm = sp.textContent
          .replace(new RegExp(String.fromCharCode(65533), 'g'), '')
          .replace('\n', ' ')
          .trim();
      } else {
        if (!sp.innerHTML) {
          console.log(p.innerHTML);
          console.log(sp.innerHTML);
          console.log('No sp.innerHTML');
        }
        if (sp.innerHTML.includes('/BillLookup/History.aspx?')) {
          const a = sp.getElementsByTagName('a')[0];
          const href = a.getAttribute('href');

          searchStr = 'LegSess=';
          startIndex = href.indexOf(searchStr) + searchStr.length;
          endIndex = href.indexOf('&', startIndex);
          session = href.substring(startIndex, endIndex);
          searchStr = 'Bill=';
          startIndex = href.indexOf(searchStr, startIndex) + searchStr.length;
          endIndex = href.length;
          bill_cd = href.substring(startIndex, endIndex);
          bill_name = a.firstChild.textContent;
          position = '';
          witness = '';
          rbnt = false;
        } else if (sp.textContent.includes('For:')) {
          position = 'For';
        } else if (sp.textContent.includes('On:')) {
          position = 'On';
        } else if (sp.textContent.includes('Against:')) {
          position = 'Against';
        } else if (
          sp.innerHTML.includes('Registering,') &&
          sp.innerHTML.includes('but not testifying:')
        ) {
          rbnt = true;
        } else if (
          sp.innerHTML.includes('<u>WITNESS') &&
          sp.innerHTML.includes('LIST</u>')
        ) {
          //do nothing
        } else {
          const fullWitnessName = sp.textContent
            .replace(new RegExp(String.fromCharCode(65533), 'g'), '')
            .trim();
          if (fullWitnessName == page) {
            //this is actually a line in the HTML showing what page of records it is.
            page++;
          } else {
            self = false;
            const splitWitness = splitFullWitness(fullWitnessName);
            if (
              fullWitnessName.toUpperCase().includes('SELF;') ||
              fullWitnessName.toUpperCase().includes('SELF)')
            )
              self = true;
            if (session != '' && bill_cd != '') {
              records.push({
                meeting_cd,
                committee,
                dttm,
                session,
                bill_name,
                bill_cd,
                position,
                rbnt,
                self,
                fullWitnessName,
                given_name: splitWitness.givenName,
                sur_name: splitWitness.surName,
                organization: splitWitness.organization,
              });
            }
          }
        }
      }
    });
    return records;
  },
};
function splitFullWitness(fullWitness) {
  let witnessObj = {};
  const splitWitness = fullWitness.split('\n');
  witnessObj.surName = splitWitness[0].trim();
  if (witnessObj.surName.endsWith(',')) {
    witnessObj.surName = witnessObj.surName.substring(
      0,
      witnessObj.surName.length - 1
    );
  }
  if (splitWitness[1]) {
    const givenAndOrgName = splitWitness[1].split('(');
    witnessObj.givenName = givenAndOrgName[0].trim();
    if (givenAndOrgName[1]) {
      witnessObj.organization = givenAndOrgName[1]
        .replace('Self;', '')
        .replace('Self)', '')
        .trim();
      if (witnessObj.organization.endsWith(')')) {
        witnessObj.organization = witnessObj.organization.substring(
          0,
          witnessObj.organization.length - 1
        );
      }
    } else {
      //Most likely scenario: Organization name listed as individual's name
      witnessObj.organization = witnessObj.givenName + ' ' + witnessObj.surName;
    }
  }
  return witnessObj;
}
