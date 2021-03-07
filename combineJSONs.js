const fs = require('fs');
const path = require('path');

let entity = '';

if (!process.argv[2] || process.argv[2].substring(0, 1) === '-h') {
  console.log('Usage (from root of project): node combineJSONs.js <entity>');
  console.log(
    'This writes <entity.JSON> in (root of project)/{entitydir} and assumes a dir in subdir called JSON with individual JSON files.'
  );
  console.log(
    'If there are multiple subdirs of (root of project)/{entitydir} '
  );
  process.exit();
} else {
  entity = process.argv[2];
  if (entity.endsWith('/')) entity = entity.substring(0, entity.length - 1);
}

//Combine subdirs to individual JSON Files
const entityJSONDir = fs.readdirSync(path.join(entity, 'JSON'), {
  withFileTypes: true,
});
entityJSONDir
  .filter((ent) => ent.isDirectory())
  .map((ent) => ent.name)
  .forEach((JSONDir) => {
    const JSONFile = `${JSONDir}.JSON`;

    const files = fs.readdirSync(path.join(entity, 'JSON', JSONDir));
    const data = [];

    files.forEach((file) => {
      const oneDataFileData = JSON.parse(
        fs.readFileSync(path.join(entity, 'JSON', JSONDir, file)).toString()
      );
      oneDataFileData.forEach((oneData) => {
        data.push(oneData);
      });
    });
    fs.writeFileSync(path.join(entity, 'JSON', JSONFile), JSON.stringify(data));
    console.log(`${JSONFile} written to ${entity}/JSON/`);
  });

//now combine any files in the root JSON Dir
const JSONFile = `${entity}.JSON`;

const files = fs.readdirSync(path.join(entity, 'JSON'), {
  withFileTypes: true,
});
const data = [];

console.log(files.filter((ent) => ent.isFile()).map((ent) => ent.name));
files
  .filter((ent) => ent.isFile())
  .map((ent) => ent.name)
  .forEach((file) => {
    console.log(`Reading ${file}`);
    const oneDataFileData = JSON.parse(
      fs.readFileSync(path.join(entity, 'JSON', file)).toString()
    );
    console.log('pushing...');
    oneDataFileData.forEach((oneData) => {
      data.push(oneData);
    });
  });

console.log('Writing');
fs.writeFileSync(path.join(entity, JSONFile), JSON.stringify(data));
console.log(`${JSONFile} written to ${entity}`);
