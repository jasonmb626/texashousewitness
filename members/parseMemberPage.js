const fs = require('fs');
const jsdom = require('jsdom');

const basename='memberDisplay.cfm?memberID=';

const memberId = process.argv[2];
const memberFullName = process.argv[3];

console.log (memberId + ' ' + memberFullName);

if (!memberId || !memberFullName) {
    console.log('You must supply the memberId and member full name in the commandLine');
}

const {JSDOM} = jsdom;

let member_surnames = [];

try {
    const member_surnames_json = fs.readFileSync('member_surnames.json').toString();
    member_surnames = JSON.parse(member_surnames_json);
} catch (e) {
    //file doesn't exist. Ignore. We're just starting out.
} 

const html = fs.readFileSync(basename + memberId).toString();
const dom = new JSDOM(html).window.document;

const img = dom.querySelector('.body2ndLevel > p:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > a:nth-child(1) > img:nth-child(1)');

const imgSrc = img.getAttribute('src');
let startIndex = imgSrc.indexOf('/thumbnails/') + '/thumbnails/'.length;
const surnameLetter = imgSrc.slice(startIndex, startIndex+1);

member_surnames.push({
    memberId,
    surname: guessSurnameBasedOnStartLetter(memberFullName, surnameLetter)
});

const namesCell = dom.querySelector('span[style*="175%"]').parentElement;

startIndex = namesCell.innerHTML.indexOf('Other surnames:') + 'Other surnames:'.length;
const endIndex = namesCell.innerHTML.indexOf('<br>', startIndex);
let otherSurnames = '';
if (startIndex >= 'Other surnames:'.length && endIndex >= 'Other surnames:'.length) {
    otherSurnames = namesCell.innerHTML.slice(startIndex, endIndex).trim();
}
if (otherSurnames != '') {
    otherSurnames.split(',').forEach (name => {
        if (name.trim() !== '') {
            member_surnames.push({
                memberId,
                surname: name.trim() 
            });
        }
    })
}

fs.writeFileSync('member_surnames.json', JSON.stringify(member_surnames));

function guessSurnameBasedOnStartLetter(fullName, letter) {
    const splitNames = fullName.split(' ');
    for (let i = splitNames.length - 1; i>= 0; i--) {
        if (splitNames[i].slice(0, 1).toUpperCase() === letter.toUpperCase()) {
            return splitNames.slice(i).join(' ');
        }
    }
    return ''
}
// console.log(guessSurnameBasedOnStartLetter('Clyde Alexander', 'A'));
// console.log(guessSurnameBasedOnStartLetter('Leticia Van de Putte', 'V'));