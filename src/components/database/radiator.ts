import mongoose from "mongoose";

// Mongo Connection
mongoose.Promise = global.Promise;
const conn = mongoose.createConnection("mongodb://localhost:27017/devices");

const radiatorSchema = new mongoose.Schema({
  id: { type: String },
  inlet: { type: Number },
  outlet: { type: Number },
});

const RadiatorStore = conn.model("radiator", radiatorSchema);

export default RadiatorStore;
