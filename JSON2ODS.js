const fs = require('fs');
const path = require('path');

const XLSX = require('xlsx');

let entity = '';
let basePath = '';

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

const JSONFile = path.join(entity, `${entity}.JSON`);
const ODSFile = path.join(entity, `${entity}.ods`);

const data = JSON.parse(fs.readFileSync(JSONFile).toString());

/* create a new blank workbook */
const wb = XLSX.utils.book_new();
/* make worksheet */
const ws = XLSX.utils.json_to_sheet(data);
/* Add the worksheet to the workbook */
XLSX.utils.book_append_sheet(wb, ws, entity);
/* output format determined by filename */
XLSX.writeFile(wb, ODSFile);
console.log(`${ODSFile} written!`);
