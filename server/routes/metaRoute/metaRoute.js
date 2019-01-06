const db = require('../../database/database');
const { pipe } = require('lodash/fp');

async function getTotalMatches(collection) {
  const count = await collection.countDocuments();
  return count;
}

async function getMetaData(req, res) {
  console.log('req: ', req.headers);
  const { id } = req.headers;
  
  if (!id) {
    throw new Error('Missing ID!');
  }
  const { totalMatches } = req.query;
  const matchesCollection = await db.getCollection(`${id}MATCHES`);

  let results = {};
  if (totalMatches) {
    results.totalMatches = await getTotalMatches(matchesCollection);
  }
  return res.status(200).json(results);
}


module.exports = {
  getMetaData,
}