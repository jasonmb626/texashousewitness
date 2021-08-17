const fetch = require('node-fetch');

async function getSessionHTML() {
  const res = await fetch('https://capitol.texas.gov');
  return await res.text();
}

module.exports = {
  getSessionHTML,
};
