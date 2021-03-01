const fs = require('fs');
const path = require('path');

let entity = '';

if (!process.argv[2] || process.argv[2].substring(0, 1) === '-h') {
  console.log('Usage (from root of project): node combineJSONs.js <entity>');
  console.log(
    'This writes <entity.JSON> in (root of project)/{subdir} and assumes a dir in subdir called JSON with individual JSON files.'
  );
  process.exit();
} else {
  entity = process.argv[2];
  if (entity.endsWith('/')) entity = entity.substring(0, entity.length - 1);
}

const JSONFile = `${entity}.JSON`;

const files = fs.readdirSync(path.join(entity, 'JSON'));
const data = [];

files.forEach((file) => {
  const oneDataFileData = JSON.parse(
    fs.readFileSync(path.join(entity, 'JSON', file)).toString()
  );
  oneDataFileData.forEach((oneData) => {
    data.push(oneData);
  });
});

fs.writeFileSync(path.join(entity, JSONFile), JSON.stringify(data));

console.log(`${JSONFile} written to ${entity}`);
