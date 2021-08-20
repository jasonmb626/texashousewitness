const fs = require('fs');

function shouldProcessHTMLToJSON(htmlFile, jsonfile) {
  const htmlstats = fs.statSync(htmlFile);
  const html_dttm = new Date(htmlstats.mtime);
  let jsonstats;
  let json_dttm;
  try {
    jsonstats = fs.statSync(jsonfile);
    json_dttm = new Date(jsonstats.mtime);
    if (html_dttm > json_dttm) return true;
    return false;
  } catch (err) {
    return true;
  }
}

function shouldProcessJSON(JSONFile, dbUpdateDTTM) {
  const JSONMTime = new Date(fs.statSync(JSONFile).mtime);
  const UTime = new Date(dbUpdateDTTM);
  return JSONMTime > UTime;
}

async function setFileProcessedDTTM(pool, filename) {
  await pool.query(
    `
    INSERT INTO w_file (filename, processed_dttm)
    VALUES($1, CURRENT_TIMESTAMP) 
    ON CONFLICT (filename) 
    DO 
      UPDATE SET processed_dttm = CURRENT_TIMESTAMP;
    `,
    [filename]
  );
}

module.exports = {
  shouldProcessHTMLToJSON,
  shouldProcessJSON,
  setFileProcessedDTTM,
};
