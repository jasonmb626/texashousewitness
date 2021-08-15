const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '..', 'session', 'index.html');
const html = fs.readFileSync(filepath).toString();

module.exports = () => Promise.resolve({ text: () => html });
