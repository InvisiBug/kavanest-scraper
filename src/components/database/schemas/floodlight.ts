import mongoose from "mongoose";

const FloodlightSchema = new mongoose.Schema({
  id: { type: String },
  state: { type: String },
});

export default FloodlightSchema;
