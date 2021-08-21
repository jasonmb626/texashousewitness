const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const { wasHTMLUpdatedSinceLastProcessToJSON } = require('../../support');

const {
  getMemberIDFromMemberURL,
  processLegHTMLtoJSObj,
} = require('./support');

const HTMLDir = path.join(__dirname, '..', 'HTML');
const HTMLFiles = fs.readdirSync(HTMLDir);

(async () => {
  HTMLFiles.forEach(async (filebase) => {
    const HTMLfilename = path.join(HTMLDir, filebase);
    const JSONfilename = path.join(
      __dirname,
      '..',
      'JSON',
      filebase.replace('.html', '.json')
    );
    if (wasHTMLUpdatedSinceLastProcessToJSON(HTMLfilename, JSONfilename)) {
      const html = fs.readFileSync(HTMLfilename).toString();
      const end = filebase.indexOf('.html');
      const leg = +filebase.substr(0, end);
      const reps = processLegHTMLtoJSObj(leg, html);
      fs.writeFileSync(JSONfilename, JSON.stringify(reps));
    }
  });
})();

function decodeLegislatures(instr) {
  const legislatureRanges = instr.split('\t');
  const legislatures = [];
  legislatureRanges.forEach((range) => {
    if (range != '') {
      const legislaturesStr = range.trim().split('\n');
      const start = parseInt(legislaturesStr[0].trim().slice(0, 2));
      const ends = legislaturesStr[legislaturesStr.length - 1]
        .trim()
        .split('-');
      const end = parseInt(ends[ends.length - 1].trim().slice(0, 2));
      legislatures.push({ start, end });
    }
  });
  return legislatures;
}
