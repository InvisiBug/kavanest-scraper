import mongoose from "mongoose";

// Mongo Connection
mongoose.Promise = global.Promise;
const conn = mongoose.createConnection("mongodb://localhost:27017/sun");

const sunSchema = new mongoose.Schema({
  id: { type: String },
  state: { type: String },
});

const SunStore = conn.model("sun", sunSchema);

export default SunStore;
