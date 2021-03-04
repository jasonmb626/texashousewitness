module.exports = {
  scrape: function (html, meeting_cd) {
    const witnessRecords = [];
    let witnessRecord = {};
    let mode = 'ENTER';
    let committee = '';
    let dttm = '';
    let startIndex = -1;
    let endIndex = -1;
    let searchStr = '';
    let session = '';
    let bill_cd = '';
    let bill_name = '';
    let witnessName = '';
    let position = '';
    let rbnt = false;
    let self = false;
    let restOfLine = '';

    const lines = html.split('\n');
    lines.forEach((line) => {
      restOfLine = '';
      if (mode === 'ENTER' && line.includes('WITNESS LIST')) {
        mode = 'COMMITTEE NAME';
      } else if (mode === 'COMMITTEE NAME' && line.trim() !== '') {
        committee = line.trim();
        mode = 'DTTM';
      } else if (mode === 'DTTM' && line.trim() !== '') {
        dttm = line.trim();
        mode = 'WITNESS_RECORDS';
      } else if (mode === 'WITNESS_RECORDS' && !lineBlankOrClosingHTML(line)) {
        searchStr = '/BillLookup/History.aspx?LegSess=';
        if (line.includes(searchStr)) {
          witnessRecord = {};
          witnessName = '';
          organization = '';
          position = '';
          rbnt = false;
          self = false;
          startIndex = line.indexOf(searchStr) + searchStr.length;
          endIndex = line.indexOf('&', startIndex);
          session = line.substring(startIndex, endIndex);
          searchStr = 'Bill=';
          startIndex = line.indexOf(searchStr) + searchStr.length;
          endIndex = line.indexOf('"', startIndex);
          bill_cd = line.substring(startIndex, endIndex);
          startIndex = line.indexOf('>', endIndex) + 1;
          endIndex = line.indexOf('</A>', startIndex);
          bill_name = line.substring(startIndex, endIndex);
        } else {
          searchStr = 'For:';
          if (line.includes(searchStr)) {
            position = 'For';
            restOfLine = line.replace(searchStr, '').trim();
          }
          searchStr = 'On:';
          if (line.includes(searchStr)) {
            position = 'On';
            restOfLine = line.replace(searchStr, '').trim();
          }
          searchStr = 'Against:';
          if (line.includes(searchStr)) {
            position = 'Against';
            restOfLine = line.replace(searchStr, '').trim();
          }
          searchStr = 'Registering, but not testifying:';
          if (line.includes(searchStr)) {
            position = '';
            rbnt = true;
          } else {
            if (restOfLine === '') restOfLine = line.trim();
            self = false;
            const splitWitness = splitOneWitness(restOfLine);
            if (splitWitness.organization.toUpperCase().startsWith('SELF')) {
              self = true;
              splitWitness.organization = splitWitness.organization
                .substring(4, splitWitness.organization.length)
                .trim();
            } else if (
              splitWitness.organization.toUpperCase().endsWith('SELF')
            ) {
              self = true;
              splitWitness.organization = splitWitness.organization
                .substring(
                  splitWitness.organization.length - 4,
                  splitWitness.organization.length
                )
                .trim();
            }
            searchStr = 'SELF &';
            if (splitWitness.organization.toUpperCase().includes(searchStr)) {
              startIndex = splitWitness.organization
                .toUpperCase()
                .indexOf(searchStr);
              endIndex = startIndex + searchStr.length;
              const middleOfString = splitWitness.organization.substring(
                startIndex,
                endIndex
              );
              splitWitness.organization = splitWitness.organization.replace(
                middleOfString,
                ''
              );
              self = true;
            }
            searchStr = '& SELF';
            if (splitWitness.organization.toUpperCase().includes(searchStr)) {
              startIndex = splitWitness.organization
                .toUpperCase()
                .indexOf(searchStr);
              endIndex = startIndex + searchStr.length;
              const middleOfString = splitWitness.organization.substring(
                startIndex,
                endIndex
              );
              splitWitness.organization = splitWitness.organization.replace(
                middleOfString,
                ''
              );
              self = true;
            }
            witnessRecord = {
              meeting_cd,
              committee,
              dttm,
              session,
              bill_name,
              bill_cd,
              position,
              rbnt,
              self,
              fullWitnessName: restOfLine,
              given_name: splitWitness.given_name,
              sur_name: splitWitness.sur_name,
              organization: splitWitness.organization,
            };
            witnessRecords.push(witnessRecord);
          }
        }
      }
    });
    return witnessRecords;
  },
};

function splitOneWitness(fullWitnessName) {
  let given_name = '';
  let sur_name = '';
  let organization = '';
  let restOfLine = '';

  let startIndex = fullWitnessName.indexOf('(');
  let endIndex = -1;
  if (startIndex > 1) {
    endIndex = fullWitnessName.indexOf(')', startIndex) + 1;
    if (endIndex === -1) endIndex = fullWitnessName.length;
    organization = fullWitnessName.substring(startIndex, endIndex);
  }
  restOfLine = fullWitnessName.replace(organization, '').trim();
  organization = organization.substring(1, organization.length - 1);
  startIndex = 0;
  endIndex = restOfLine.indexOf(',');
  if (endIndex !== -1) {
    sur_name = restOfLine.substring(0, endIndex);
    startIndex = endIndex + 1;
    endIndex = restOfLine.length;
    given_name = restOfLine.substring(startIndex, endIndex).trim();
  } else {
    given_name = restOfLine.substring(0, restOfLine.length).trim();
  }
  return {
    given_name,
    sur_name,
    organization,
  };
}

function lineBlankOrClosingHTML(line) {
  let blank = false;
  if (line.trim() === '') blank = true;
  if (line.toUpperCase().includes('</PRE>')) blank = true;
  if (line.toUpperCase().includes('</BODY>')) blank = true;
  if (line.toUpperCase().includes('</HTML>')) blank = true;
  return blank;
}
