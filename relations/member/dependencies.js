const {
  getMemberIDFromMemberURL,
} = require('../representation/processLegHTML/support');
const { insertWork_RepresentationRecords } = require('../representation/db');

module.exports = { getMemberIDFromMemberURL, insertWork_RepresentationRecords };
