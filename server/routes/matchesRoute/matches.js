const moment = require('moment');
const db = require('../../database/database');

async function storeMiscData(key, miscData={}) {
  try {
    const collection = await db.getCollection(`${key}MISC`);
    const miscDoc = await collection.findOne({});
    const lastPageTokenUpdate = Date.now();

    if (!miscDoc) {
      return collection.insertOne({ $set: { ...miscData, lastPageTokenUpdate } });
    }
    return collection.updateOne({_id: miscDoc._id}, { $set: { ...miscData, lastPageTokenUpdate } });
  }
  catch (e) {
    console.log('An Error occured when storing pageToken');
    console.log(e);
    return;
  }
}

async function storeMatchesFromTinder(key, tinderMatches=[]) {
  try {
    const collection = await db.getCollection(`${key}MATCHES`);
    const lastUpdate = Date.now();
    return Promise.all(tinderMatches.map(async match => {
      const storedMatch = await collection.findOne({ _id: match.id });
      const lastActivity = moment(match.last_activity_date).valueOf();
      if (storedMatch) {
        console.log('Match already found, updating');
        return collection.updateOne({ _id: match.id }, { $set: { tinderMatch: match, lastUpdate, lastActivity}})
      }
      return collection.insertOne({ _id: match.id, tinderMatch: match, lastUpdate, lastActivity})
    }));
  }
  catch (e) {
    console.log('An Error occured when storing matches');
    console.log(e);
    return;
  }

}

async function getStoredMatches(key, start=0, size=60) {
  const collection = await db.getCollection(`${key}MATCHES`);
  const matches = await collection.find({}).sort({ lastActivity: -1 }).toArray();
  const batch = matches.slice(start, start + size);
  return batch.map(match => match.tinderMatch);
}

async function getAllStoredMatches(key) {
  const collection = await db.getCollection(`${key}MATCHES`);
  const matches = await collection.find({}).toArray() || [];
  return matches.map(match => match.tinderMatch);
}

async function getMiscData(key, requestedData=[]) {
  const collection = await db.getCollection(`${key}MISC`);
  const miscDoc = await collection.findOne({});
  if (!miscDoc) return {};
  console.log('miscDoc: ', miscDoc);
  return requestedData ? requestedData.reduce((acc, data) => {
    return miscDoc[data] ? { ...acc, [data] : miscDoc[data] } : acc;
  }, {}) : miscDoc;
}

module.exports = {
  storeMiscData,
  getMiscData,
  storeMatchesFromTinder,
  getStoredMatches,
  getAllStoredMatches,
}