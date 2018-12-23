require('dotenv').config({ path: 'variables.env'})
const mongo = require('mongodb').MongoClient;
const mongoURL = process.env.DATABASE;

let mongodbConnection;

const connectionOptions = {
  promiseLibrary: Promise,
  useNewUrlParser: true,
};

function setupEventListeners(db) {
  db.on('error', error => console.log('mongoDB error', error));
  db.on('close', () => {
    console.log('mongoDB connection closed');
    mongodbConnection = null;
  });
  db.on('reconnect', () => console.log('mongoDB reconnect'));
  db.on('timeout', () => console.log('mongoDB timeout'));
}

async function getCollection(collectionName) {
  let collection;
  try {
    if (mongodbConnection) {
      collection = await mongodbConnection.collection(collectionName);
      console.log('collection: ', collection);
      if (!collection.length) return Promise.resolve(createCollection(collectionName));
      return collection;
      }
  
    await mongo
      .connect(
        mongoURL,
        connectionOptions
      )
      .then(client => {
        console.log('Connected to Mongo');
        setupEventListeners(client);
        mongodbConnection = client.db('TUI');
      });
      collection = await mongodbConnection.collection(collectionName);
      console.log('collection: ', collection);
      if (!collection.length) return Promise.resolve(createCollection(collectionName));
      return collection;
  }
  catch (e) {
    console.log(e);
    return;
  }
}

function createCollection(collectionName) {
  console.log(`Creating a collection with name: ${collectionName}`);
  return mongodbConnection.createCollection(collectionName)
}


module.exports = {
  getCollection,
  createCollection,
}