import Mongo from "./mongo";

const db = "devices";

const mongo = new Mongo();

export const rgbLightStore = mongo.newCollection(db, "rgbLights");
export const radiatorStore = mongo.newCollection(db, "radiators");
export const sensorStore = mongo.newCollection(db, "sensors");
export const zigbeeSensorStore = mongo.newCollection(db, "zigbeeSensors");
export const valveStore = mongo.newCollection(db, "valves");
export const plugStore = mongo.newCollection(db, "plugs");

export const specialsStore = mongo.newCollection(db, "specials");
export const options = { new: true, upsert: true };
