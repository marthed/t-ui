require('dotenv').config({ path: 'variables.env' });
const mongo = require('mongodb').MongoClient;
const mongoURL = process.env.DATABASE;

let dB;

const connectionOptions = {
  promiseLibrary: Promise,
  useNewUrlParser: true,
};

function setupEventListeners(db) {
  db.on('error', error => console.log('mongoDB error', error));
  db.on('close', () => {
    console.log('mongoDB connection closed');
    dB = null;
  });
  db.on('reconnect', () => console.log('mongoDB reconnect'));
  db.on('timeout', () => console.log('mongoDB timeout'));
}

async function doesCollectionExist(collectionName) {
  console.log('collectionName: ', collectionName);
  const collections = await dB.listCollections({}, { nameOnly: true }).toArray();
  console.log('collectionNames: ', collections);
  return collections.filter(col => col.name === collectionName).length > 0;
}

function createCollection(collectionName) {
  console.log(`Creating a collection with name: ${collectionName}`);
  return dB.createCollection(collectionName);
}

async function getCollection(collectionName) {
  try {
    if (dB) {
      const collectionExists = await doesCollectionExist(collectionName);
      console.log('collectionExists: ', collectionExists);
      if (!collectionExists) {
        return createCollection(collectionName);
      } else {
        return dB.collection(collectionName);
      }
    }

    return mongo
      .connect(
        mongoURL,
        connectionOptions
      )
      .then(async client => {
        console.log('Connected to Mongo');
        setupEventListeners(client);
        dB = client.db('TUI');
        const collectionExists = await doesCollectionExist(collectionName);
        console.log('collectionExists: ', collectionExists);
        if (!collectionExists) {
          return createCollection(collectionName);
        } else {
          return dB.collection(collectionName);
        }
      });
  } catch (e) {
    console.log(e);
    return;
  }
}


module.exports = {
  getCollection,
  createCollection,
};
