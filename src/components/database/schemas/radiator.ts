import mongoose from "mongoose";

const radiatorSchema = new mongoose.Schema({
  room: { type: String },
  inlet: { type: Number },
  outlet: { type: Number },
});

export default radiatorSchema;
