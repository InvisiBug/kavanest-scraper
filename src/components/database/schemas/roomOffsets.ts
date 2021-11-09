import mongoose from "mongoose";

const RoomOffsetSchema = new mongoose.Schema({
  name: { type: String },
  livingRoom: { type: Number },
  kitchen: { type: Number },
  liamsRoom: { type: Number },
  study: { type: Number },
  ourRoom: { type: Number },
});

export default RoomOffsetSchema;
