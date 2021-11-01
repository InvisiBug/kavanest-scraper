import mongoose from "mongoose";
import { Floodlight, Sun, Radiator, Sensor } from "./schemas";
require("dotenv").config();

const connection = mongoose.createConnection(process.env.URI ?? "");

connection.on("connected", () => {
  console.log("🔗 Connected to " + process.env.URI ?? "");
});

connection.on("error", (err) => {
  console.log("Mongoose connection error" + err);
});

//* Mongoose store models
export const FloodlightStore = connection.model("floodlight", Floodlight);
export const RadiatorStore = connection.model("radiator", Radiator);
export const SensorStore = connection.model("sensor", Sensor);
export const SunStore = connection.model("sun", Sun);

export const options = { new: true, upsert: true };
