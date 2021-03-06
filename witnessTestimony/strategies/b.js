const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
  scrape: function (html, meeting_cd) {
    const dom = new JSDOM(html).window.document;

    let committee = '';
    let dttm = '';

    const outerRows = dom.querySelectorAll(
      'body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr'
    );

    //"args": ["./capitol.texas.gov/tlodocs/80R/witlistmtg/html/C6502007042513301.HTM"],
    let searchStr;
    let startIndex = -1;
    let endIndex = -1;

    const records = [];
    let bill_name = '';
    let bill_cd = '';
    let session = '';
    let position = '';
    let rbnt = false;

    Array.from(outerRows).forEach((outerRow, outerI) => {
      let child = outerRow.firstChild;
      let childI = 0;
      while (child) {
        const trs = child.querySelectorAll('tr');
        if (outerI === 3 && trs.length > 0) {
          committee = trs[0].textContent;
          if (trs.length > 1) {
            dttm = trs[1].textContent;
          }
        } else if (outerI > 3) {
          const spanEl = child.querySelector('span');
          if (spanEl) {
            //if there's a span present the "witness" table should be a sibling
            const witnessTableBody = child.querySelector('tbody');
            let witnessRow = witnessTableBody.firstChild;
            let witnessI = 0;
            while (witnessRow) {
              let col = witnessRow.firstChild;
              let i = 0;
              while (col) {
                if (
                  i === 0 &&
                  col.innerHTML.includes('/BillLookup/History.aspx?')
                ) {
                  const a = col.getElementsByTagName('a')[0];
                  const href = a.getAttribute('href');

                  searchStr = 'LegSess=';
                  startIndex = href.indexOf(searchStr) + searchStr.length;
                  endIndex = href.indexOf('&', startIndex);
                  session = href.substring(startIndex, endIndex);
                  searchStr = 'Bill=';
                  startIndex =
                    href.indexOf(searchStr, startIndex) + searchStr.length;
                  endIndex = href.length;
                  bill_cd = href.substring(startIndex, endIndex);
                  bill_name = a.firstChild.textContent;
                  position = '';
                  witness = '';
                  rbnt = false;
                } else if (i > 0) {
                  if (col.textContent.toUpperCase().includes('FOR:')) {
                    position = 'For';
                  } else if (col.textContent.toUpperCase().includes('ON:')) {
                    position = 'On';
                  } else if (
                    col.textContent.toUpperCase().includes('AGAINST:')
                  ) {
                    position = 'Against';
                  } else if (
                    col.innerHTML.includes('Registering,') &&
                    col.innerHTML.includes('but not testifying:')
                  ) {
                    rbnt = true;
                  } else {
                    const fullWitnessName = col.textContent.trim();
                    if (fullWitnessName) {
                      const splitWitness = splitFullWitness(fullWitnessName);
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
                          self: splitWitness.self,
                          fullWitnessName,
                          given_name: splitWitness.givenName,
                          sur_name: splitWitness.surName,
                          organization: splitWitness.organization,
                        });
                      }
                    }
                  }
                }
                i++;
                col = col.nextSibling;
              }
              witnessI++;
              witnessRow = witnessRow.nextSibling;
            }
          } else {
            if (dttm === '') {
              //the dttm cell was separated from the committee name. I don't know why the information is so inconsistently laid out.
              dttmEl = child.querySelector('td');
              if (dttmEl) dttm = dttmEl.textContent;
            }
          }
        }

        child = child.nextSibling;
        childI++;
      }
    });
    return records;
  },
};

function splitFullWitness(fullWitness) {
  let witnessObj = { self: false };
  let nameSplitIndex = fullWitness.indexOf(',');
  if (nameSplitIndex === -1) nameSplitIndex = fullWitness.length;
  witnessObj.surName = fullWitness.substring(0, nameSplitIndex).trim();
  if (nameSplitIndex !== fullWitness.length) {
    const givenAndOrgName = fullWitness.substring(
      nameSplitIndex + 1,
      fullWitness.length
    );
    let orgSplitIndex = givenAndOrgName.indexOf('(');
    if (orgSplitIndex === -1) orgSplitIndex = givenAndOrgName.length;
    witnessObj.givenName = givenAndOrgName.substring(0, orgSplitIndex).trim();
    if (orgSplitIndex !== givenAndOrgName.length) {
      witnessObj.organization = givenAndOrgName
        .substring(orgSplitIndex + 1, givenAndOrgName.length)
        .trim();
      if (witnessObj.organization.endsWith(')'))
        witnessObj.organization = witnessObj.organization.substring(
          0,
          witnessObj.organization.length - 1
        );
      ['HIMSELF', 'HERSELF', 'SELF'].forEach((checkWord) => {
        if (witnessObj.organization.toUpperCase().startsWith(checkWord)) {
          witnessObj.self = true;
          witnessObj.organization = witnessObj.organization
            .substring(checkWord.length, witnessObj.organization.length)
            .trim();
        } else if (witnessObj.organization.toUpperCase().endsWith(checkWord)) {
          witnessObj.self = true;
          witnessObj.organization = witnessObj.organization
            .substring(
              witnessObj.organization.length - checkWord.length,
              witnessObj.organization.length
            )
            .trim();
        }
        searchStr = `${checkWord} &`;
        if (witnessObj.organization.toUpperCase().includes(searchStr)) {
          startIndex = witnessObj.organization.toUpperCase().indexOf(searchStr);
          endIndex = startIndex + searchStr.length;
          const middleOfString = witnessObj.organization.substring(
            startIndex,
            endIndex
          );
          witnessObj.organization = witnessObj.organization.replace(
            middleOfString,
            ''
          );
          witnessObj.self = true;
        }
        searchStr = `& ${checkWord}`;
        if (witnessObj.organization.toUpperCase().includes(searchStr)) {
          startIndex = witnessObj.organization.toUpperCase().indexOf(searchStr);
          endIndex = startIndex + searchStr.length;
          const middleOfString = witnessObj.organization.substring(
            startIndex,
            endIndex
          );
          witnessObj.organization = witnessObj.organization.replace(
            middleOfString,
            ''
          );
          witnessObj.self = true;
        }
      });
    } else {
      //Most likely scenario: Organization name listed as individual's name
      witnessObj.organization = witnessObj.givenName + ' ' + witnessObj.surName;
    }
  }
  return witnessObj;
}
