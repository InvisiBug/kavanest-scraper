import mongoose from "mongoose";

const valveSchema = new mongoose.Schema({
  name: { type: String },
  id: { type: String },
  state: { type: Boolean },
  connected: { type: Boolean },
});

export default valveSchema;
