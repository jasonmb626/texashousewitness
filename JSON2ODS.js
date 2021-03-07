const fs = require('fs');
const path = require('path');

const XLSX = require('xlsx');

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

const ODSFile = path.join(entity, `${entity}.ods`);

let wb;
if (fs.existsSync(JSONFile)) {
  const data = JSON.parse(fs.readFileSync(JSONFile).toString());

  /* create a new blank workbook */
  wb = XLSX.utils.book_new();
  addWorkSheet(wb, data, entity);
} else {
  const JSONFiles = fs
    .readdirSync(path.join(entity, 'JSON'), { withFileTypes: true })
    .filter((ent) => ent.isFile())
    .map((ent) => ent.name)
    .filter((file) => file.endsWith('.JSON'));
  /* create a new blank workbook */
  wb = XLSX.utils.book_new();
  JSONFiles.forEach((file) => {
    JSONFile = path.join(entity, 'JSON', file);
    const data = JSON.parse(fs.readFileSync(JSONFile).toString());
    addWorkSheet(wb, data, file.replace('.JSON', ''));
  });
}

/* output format determined by filename */
XLSX.writeFile(wb, ODSFile);
console.log(`${ODSFile} written!`);

function addWorkSheet(wb, data, sheetName) {
  /* make worksheet */
  const ws = XLSX.utils.json_to_sheet(data);
  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}
