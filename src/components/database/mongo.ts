import { MongoClient, MongoClientOptions } from "mongodb";
import { mongoUrl } from "../helpers";

const timeout = 3000;

const options: MongoClientOptions = {
  directConnection: true,
  connectTimeoutMS: timeout,
  socketTimeoutMS: timeout,
  waitQueueTimeoutMS: timeout,
  heartbeatFrequencyMS: timeout,
  keepAlive: true,
  serverSelectionTimeoutMS: timeout,
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
