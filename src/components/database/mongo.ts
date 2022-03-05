import { MongoClient, MongoClientOptions } from "mongodb";
import { mongoUrl } from "../helpers";

const options: MongoClientOptions = {
  directConnection: true,
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
  waitQueueTimeoutMS: 1000,
  heartbeatFrequencyMS: 1000,
  keepAlive: true,
  serverSelectionTimeoutMS: 1000,
};

export default class Mongo {
  client: MongoClient = new MongoClient(mongoUrl, options);

  constructor() {
    this.connect();
  }

  connect() {
    this.client.connect((err) => {
      if (!err) {
        console.log(`🔗  Successful mongo connection made to ${mongoUrl}`);
      } else {
        console.log("⚠️  Mongo Connection Failed... Restarting");
        process.exit();
      }
    });
  }

  newCollection(database: string, collection: string) {
    const db = this.client.db(database);
    return db.collection(collection);
  }
}

// TODO add a time out and an error if the mongo connection isnt made within a few seconds
