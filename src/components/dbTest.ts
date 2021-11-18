import { Collection, Db, MongoClient } from "mongodb";

export let events: Collection;

export const connectToDB = async (uri: string, database: string, collection: string) => {
  const client: MongoClient = new MongoClient(uri);

  await client.connect();

  const db: Db = client.db(database);
  const eventsCollection: Collection = db.collection(collection);
  // eventsCollection.findOneAndUpdate({ a: 1 }, { $set: { a: 2 } }, { upsert: true });

  // Persist the connection
  events = eventsCollection;

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${eventsCollection.collectionName}`);
};

// connectToDB(process.env.URI ?? "", "newDatabase", "test");

// test.findOneAndUpdate({ a: 1 });
// TODO add one doc to events
