import mongoose from "mongoose";
require("dotenv").config();

// Mongo Connection
mongoose.Promise = global.Promise;
const conn = mongoose.createConnection(process.env.URI ?? "");

const sunSchema = new mongoose.Schema({
  id: { type: String },
  state: { type: String },
});

const SunStore = conn.model("sun", sunSchema);

export default SunStore;
