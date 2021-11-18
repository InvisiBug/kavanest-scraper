import { MongoClient, Collection } from "mongodb";

const FILE_DB_HOST = process.env.FILE_DB_HOST as string;
const FILE_DB_DATABASE = process.env.FILE_DB_DATABASE as string;
const FILES_COLLECTION = process.env.FILES_COLLECTION as string;

// if (!FILE_DB_HOST || !FILE_DB_DATABASE || !FILES_COLLECTION) {
//   throw "Missing FILE_DB_HOST, FILE_DB_DATABASE, or FILES_COLLECTION environment variables.";
// }

process.env.URI ?? "", "newDatabase", "test";
const client = new MongoClient(process.env.URI ?? "");

class Mongoose {
  connection: any;
  db: any;
  store: any;

  constructor() {
    this.connection = this.makeConnection();
    this.db = this.connectToDB();
    this.store = this.connectToStore();
  }

  async makeConnection() {
    const test = await client.connect();
    return test;
  }
  async connectToDB() {
    const FileDB = this.connection.db("newDatabase");
    return FileDB;
  }
  async connectToStore() {
    const store = this.db.collection("test");
    return store;
  }

  // static async init() {
  //   const connection = await client.connect();
  //   const FileDB = connection.db("newDatabase");
  //   Mongoose.FilesCollection = FileDB.collection("test");
  //   // Mongoose.FilesCollection.findOneAndUpdate({ a: 1 }, { $set: { a: 1 } }, { upsert: true });
  // }
}

const test = new Mongoose();

export const testStore = new Mongoose();

// const testStore = new Mongoose();
// console.log("hello");

// export default Mongoose;

// import { MongoClient, Collection } from "mongodb";

// const FILE_DB_HOST = process.env.FILE_DB_HOST as string;
// const FILE_DB_DATABASE = process.env.FILE_DB_DATABASE as string;
// const FILES_COLLECTION = process.env.FILES_COLLECTION as string;

// // if (!FILE_DB_HOST || !FILE_DB_DATABASE || !FILES_COLLECTION) {
// //   throw "Missing FILE_DB_HOST, FILE_DB_DATABASE, or FILES_COLLECTION environment variables.";
// // }

// process.env.URI ?? "", "newDatabase", "test";
// const client = new MongoClient(process.env.URI ?? "");

// export default class Mongoose {
//   static FilesCollection: Collection;

//   static async init() {
//     const connection = await client.connect();
//     const FileDB = connection.db("newDatabase");
//     Mongoose.FilesCollection = FileDB.collection("test");
//     // Mongoose.FilesCollection.findOneAndUpdate({ a: 1 }, { $set: { a: 1 } }, { upsert: true });
//   }
// }

// Mongoose.init();

// export const connection = Mongoose.FilesCollection

// // export default Mongoose;
