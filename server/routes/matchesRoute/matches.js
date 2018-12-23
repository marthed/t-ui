const db = require('../../database/database');

async function storeMatchesFromTinder(key, tinderMatches=[]) {
  try {
    const collection = await db.getCollection(`${key}MATCHES`);
    const lastUpdate = Date.now();
    return Promise.all(tinderMatches.forEach(async match => {
      const storedMatch = await collection.findOne({ _id: match.id });
      if (storedMatch) {
        console.log('Match already found, updating');
        return collection.updateOne({ _id: match.id }, { $set: { tinderMatch: match, lastUpdate: lastUpdate}})
      }
      return collection.insertOne({ _id: match.id, tinderMatches: match, lastUpdate: lastUpdate})
    }));
  }
  catch (e) {
    console.log('An Error occured when storing matches');
    console.log(e);
    return;
  }

};

async function getStoredMatches(key) {
  try {
    const collection = await db.getCollection(`${key}MATCHES`);
    return collection.find({}).toArray();
  }
  catch (e) {
    console.log('An error occured when fetching stored matches');
    return [];
  }
}

module.exports = {
  storeMatchesFromTinder,
  getStoredMatches,
}