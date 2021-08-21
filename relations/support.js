const fs = require('fs');

async function wasFileUpdatedSinceLastProcessed(pool, filename) {
  let processedDTTM;
  let modifiedDTTM;

  try {
    const fileStats = fs.statSync(filename);
    modifiedDTTM = new Date(fileStats.mtime);
  } catch (err) {
    throw new Error('File not found');
  }

  try {
    processedDTTM = await getFileProcessedDTTM(pool, filename);
  } catch (err) {
    console.error(err);
    return false;
  }
  return processedDTTM < modifiedDTTM;
}

function wasHTMLUpdatedSinceLastProcessToJSON(htmlFile, jsonfile) {
  const htmlstats = fs.statSync(htmlFile);
  const html_dttm = new Date(htmlstats.mtime);
  let jsonstats;
  let json_dttm;
  try {
    jsonstats = fs.statSync(jsonfile);
    json_dttm = new Date(jsonstats.mtime);
    return html_dttm > json_dttm;
  } catch (err) {
    return true;
  }
  d;
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

async function getFileProcessedDTTM(pool, filename) {
  try {
    const res = await pool.query(
      `
      SELECT processed_dttm FROM w_file
      WHERE filename=$1;
      `,
      [filename]
    );
    if (res.rows.length === 1) {
      return new Date(res.rows[0].processed_dttm);
    }
  } catch (err) {
    return null;
  }
  return null;
}

module.exports = {
  wasHTMLUpdatedSinceLastProcessToJSON,
  setFileProcessedDTTM,
  getFileProcessedDTTM,
  wasFileUpdatedSinceLastProcessed,
};
