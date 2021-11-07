import mongoose from "mongoose";
import { floodlight, sun, radiator, sensor, plug } from "./schemas";
require("dotenv").config();

const connection = mongoose.createConnection(process.env.URI ?? "");

connection.on("connected", () => {
  console.log("🔗 Connected to " + process.env.URI ?? "");
});

connection.on("error", (err) => {
  console.log("Mongoose connection error" + err);
});

//* Mongoose store models
export const floodlightStore = connection.model("floodlight", floodlight);
export const radiatorStore = connection.model("radiator", radiator);
export const sensorStore = connection.model("sensor", sensor);
export const plugStore = connection.model("plug", plug);
export const sunStore = connection.model("sun", sun);

export const options = { new: true, upsert: true };
