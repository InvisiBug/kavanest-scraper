import mongoose from "mongoose";
require("dotenv").config();

// Mongo Connection
mongoose.Promise = global.Promise;
const conn = mongoose.createConnection(process.env.URI ?? "");

const radiatorSchema = new mongoose.Schema({
  room: { type: String },
  inlet: { type: Number },
  outlet: { type: Number },
});

const RadiatorStore = conn.model("radiator", radiatorSchema);

export default RadiatorStore;
