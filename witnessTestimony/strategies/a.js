const { check } = require('prettier');

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
    lines.forEach((line, i) => {
      restOfLine = '';
      if (mode === 'ENTER' && line.includes('WITNESS LIST')) {
        mode = 'COMMITTEE NAME';
      } else if (mode === 'COMMITTEE NAME' && line.trim() !== '') {
        committee = line.trim();
        mode = 'DTTM';
      } else if (mode === 'DTTM' && line.trim() !== '') {
        if (line.includes('(') && line.includes(')')) {
          //this is actually the subcommittee name, so appent to committee
          committee += ' ' + line.trim();
        } else {
          dttm = line.trim();
          mode = 'WITNESS_RECORDS';
        }
      } else if (mode === 'WITNESS_RECORDS' && !lineBlankOrClosingHTML(line)) {
        searchStr = '/BillLookup/History.aspx?LegSess=';
        if (line.includes(searchStr)) {
          witnessRecord = {};
          witnessName = '';
          organization = '';
          position = '';
          rbnt = false;
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
            startIndex = restOfLine.indexOf('(');
            endIndex = restOfLine.indexOf(')');
            if (endIndex < startIndex || endIndex === -1) {
              restOfLine += lines[i + 1];
              endIndex = restOfLine.indexOf(')');
              if (endIndex < startIndex || endIndex === -1) {
                error = true;
              } else {
                error = false;
                lines[i + 1] = '';
              }
            } else {
              error = false;
            }

            const splitWitness = splitOneWitness(
              removeExcessInnerspaceAndTrim(restOfLine)
            );
            witnessRecord = {
              meeting_cd,
              committee,
              dttm,
              session,
              bill_name,
              bill_cd,
              position,
              rbnt,
              self: splitWitness.self,
              fullWitnessName: restOfLine,
              given_name: splitWitness.given_name,
              sur_name: splitWitness.sur_name,
              organization: splitWitness.organization,
              error,
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
  let self = false;

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
  ['HIMSELF', 'HERSELF', 'SELF'].forEach((checkWord) => {
    if (organization.toUpperCase().startsWith(checkWord)) {
      self = true;
      organization = organization
        .substring(checkWord.length, organization.length)
        .trim();
    } else if (organization.toUpperCase().endsWith(checkWord)) {
      self = true;
      organization = organization
        .substring(organization.length - checkWord.length, organization.length)
        .trim();
    }
    searchStr = `${checkWord} &`;
    if (organization.toUpperCase().includes(searchStr)) {
      startIndex = organization.toUpperCase().indexOf(searchStr);
      endIndex = startIndex + searchStr.length;
      const middleOfString = organization.substring(startIndex, endIndex);
      organization = organization.replace(middleOfString, '');
      self = true;
    }
    searchStr = `& ${checkWord}`;
    if (organization.toUpperCase().includes(searchStr)) {
      startIndex = organization.toUpperCase().indexOf(searchStr);
      endIndex = startIndex + searchStr.length;
      const middleOfString = organization.substring(startIndex, endIndex);
      organization = organization.replace(middleOfString, '');
      self = true;
    }
  });
  return {
    given_name,
    sur_name,
    organization,
    self,
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

function removeExcessInnerspaceAndTrim(inStr) {
  let tmpStr = inStr.trim().replace('  ', ' ');
  while (tmpStr.includes('  ')) {
    tmpStr = tmpStr.replace('  ', ' ');
  }
  return tmpStr;
}
