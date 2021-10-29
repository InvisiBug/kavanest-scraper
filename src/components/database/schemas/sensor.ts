import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
  room: { type: String },
  temperature: { type: String },
  humidity: { type: String },
});

export default SensorSchema;
