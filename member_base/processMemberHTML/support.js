function parseMemberHTML(html) {
  const dom = new JSDOM(html).window.document;

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
  memberGivenNames.push({
    memberId,
    givenName,
    nickName,
  });

  memberSurNames.push({
    memberId,
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
        memberSurNames.push({
          memberId,
          surname: name.trim(),
          current: false,
        });
      }
    });
  }
}

module.exports = { parseMemberHTML };
