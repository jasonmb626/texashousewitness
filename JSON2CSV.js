const fs = require('fs');
const path = require('path');

const Papa = require('papaparse');

let entity = '';
let JSONFile = path.join(entity, `${entity}.JSON`);

if (!process.argv[2] || process.argv[2].substring(0, 1) === '-h') {
  console.log('Usage (from root of project): node JSON2ODS.js <entity> OR');
  console.log('Usage (from root of project): node JSON2ODS.js <entity>/');
  console.log(
    'This assumes <entity.JSON> exists in (root of project)/<entity>.'
  );
  process.exit();
} else {
  entity = process.argv[2];
  if (entity.endsWith('/')) entity = entity.substring(0, entity.length - 1);
}

let csvText = '';

if (fs.existsSync(JSONFile)) {
  const data = JSON.parse(fs.readFileSync(JSONFile).toString());

  csvText = Papa.unparse(data);
  const CSVFile = path.join(entity, `${entity}.csv`);
  const csvText = Papa.unparse(data);
  fs.writeFileSync(CSVFile, csvText);
} else {
  const JSONFiles = fs
    .readdirSync(path.join(entity, 'JSON'), { withFileTypes: true })
    .filter((ent) => ent.isFile())
    .map((ent) => ent.name)
    .filter((file) => file.endsWith('.JSON'));
  JSONFiles.forEach((file) => {
    JSONFile = path.join(entity, 'JSON', file);
    const data = JSON.parse(fs.readFileSync(JSONFile).toString());
    csvText = Papa.unparse(data);
    try {
      fs.mkdirSync(path.join(entity, 'CSV'));
    } catch (error) {
      //already there
    }
    fs.writeFileSync(
      JSONFile.replace('/JSON/', '/CSV/').replace('.JSON', '.CSV'),
      csvText
    );
  });
}
