import { radiator, sensor, plug, valve } from "./schemas";
import mongoose from "mongoose";
require("dotenv").config();

const connection = mongoose.createConnection(process.env.URI ?? "");

connection.on("connected", () => {
  console.log("🔗 Connected to " + process.env.URI ?? "");
});

connection.on("error", (err) => {
  console.log("Mongoose connection error" + err);
});

//* Mongoose store models
export const radiatorStore = connection.model("radiator", radiator);
export const sensorStore = connection.model("sensor", sensor);
export const plugStore = connection.model("plug", plug);
export const valveStore = connection.model("valve", valve);

export const options = { new: true, upsert: true };
