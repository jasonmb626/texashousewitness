const fs = require('fs');
const path = require('path');

const { JSDOM } = require('jsdom');
const { getMemberIDFromMemberURL } = require('../dependencies');

function guessSurnameBasedOnStartLetter(fullName, letter) {
  const splitNames = fullName.split(' ');
  for (let i = splitNames.length - 1; i >= 0; i--) {
    if (splitNames[i].slice(0, 1).toUpperCase() === letter.toUpperCase()) {
      return splitNames.slice(i).join(' ');
    }
  }
  return '';
}

function parseMemberHTML(memberId, html) {
  const dom = new JSDOM(html).window.document;
  let member;
  try {
    let memberFullNameEl = dom.querySelector(
      '.body2ndLevel > p:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)'
    );

    if (!memberFullNameEl) {
      memberFullNameEl = dom.querySelector(
        '.body2ndLevel > p:nth-child(3) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)'
      );
    }

    if (!memberFullNameEl) {
      memberFullNameEl = dom.querySelector(
        '.body2ndLevel > p:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > span:nth-child(1)'
      );
    }

    const memberFullName = memberFullNameEl.textContent;

    const memberLinkEl = dom.querySelector(
      '.body2ndLevel > p:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > ul:nth-child(1) > li:nth-child(4) > a:nth-child(1)'
    );

    if (memberLinkEl) {
      const memberLink = memberLinkEl.getAttribute('href');
      const memberIdMatch = getMemberIDFromMemberURL(memberLink);
      if (memberIdMatch !== memberId) {
        console.log(memberId + ' not matched.');
      }
    }

    let revisedMemberName = memberFullName;
    let nickName = '';
    startIndex = memberFullName.indexOf("'");
    if (startIndex > 0) {
      const endIndex = memberFullName.indexOf("'", startIndex + 1);
      if (endIndex > 0) {
        nickName = memberFullName.slice(
          startIndex + 1,
          endIndex //- startIndex
        );
      }
    }
    if (nickName !== '') {
      revisedMemberName = revisedMemberName.replace(`'${nickName}' `, '');
    }

    let givenName = '';
    let surName = '';
    const splitName = revisedMemberName.split(' ');
    if (splitName.length > 2) {
      const img = dom.querySelector(
        '.body2ndLevel > p:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > a:nth-child(1) > img:nth-child(1)'
      );

      const imgSrc = img.getAttribute('src');

      startIndex = imgSrc.indexOf('/thumbnails/') + '/thumbnails/'.length;
      const surnameLetter = imgSrc.slice(startIndex, startIndex + 1);
      (surName = guessSurnameBasedOnStartLetter(memberFullName, surnameLetter)),
        (givenName = revisedMemberName.replace(` ${surName}`));
    } else {
      givenName = splitName[0];
      surName = splitName[1];
    }
    member = {
      memberId,
      givenName,
      nickName,
      surNames: [],
    };

    member.surNames.push({
      surName,
      current: true,
    });

    const namesCell = dom.querySelector('span[style*="175%"]').parentElement;

    startIndex =
      namesCell.innerHTML.indexOf('Other surnames:') + 'Other surnames:'.length;
    const endIndex = namesCell.innerHTML.indexOf('<br>', startIndex);
    let otherSurnames = '';
    if (
      startIndex >= 'Other surnames:'.length &&
      endIndex >= 'Other surnames:'.length
    ) {
      otherSurnames = namesCell.innerHTML.slice(startIndex, endIndex).trim();
    }
    if (otherSurnames != '') {
      otherSurnames.split(',').forEach((name) => {
        if (name.trim() !== '') {
          member.surNames.push({
            surName: name.trim(),
            current: false,
          });
        }
      });
    }
  } catch (err) {
    console.error('Failure processing' + memberId);
    console.error(err);
  }
  return member;
}

function getMemberFileNameWMTimes(dir) {
  const files = fs.readdirSync(dir);
  return files.map((baseFilename) => {
    const filename = path.join(dir, baseFilename);
    const stats = fs.statSync(filename);
    return {
      memberId: getMemberIDFromMemberURL(baseFilename),
      filename,
      mtime: stats.mtime,
    };
  });
}

async function getRepMemberIDsToProcess(pool) {
  try {
    const res = await pool.query(`
    SELECT a.member_id missing, b.member_id
    FROM w_representation a LEFT JOIN member b ON b.member_id = a.member_id
    WHERE b.member_id IS NULL
    ORDER BY missing;
  `);
    return res.rows.map((row) => row.missing);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getUnprocessedMembersFromWorkReps,
  getRepMemberIDsToProcess,
  parseMemberHTML,
  getMemberFileNameWMTimes,
};
