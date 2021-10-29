import mongoose from "mongoose";
import { Floodlight, Sun, Radiator } from "./schemas";
require("dotenv").config();

const connection = mongoose.createConnection(process.env.URI ?? "");

export const FloodlightStore = connection.model("floodlight", Floodlight);
export const RadiatorStore = connection.model("radiator", Radiator);
export const SunStore = connection.model("sun", Sun);

export const options = { new: true, upsert: true };
