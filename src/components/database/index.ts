import Mongo from "./mongo";

const db = "devices";

const mongo = new Mongo();

export const rgbLightStore = mongo.newCollection(db, "rgbLights");
export const radiatorStore = mongo.newCollection(db, "radiators");
export const sensorStore = mongo.newCollection(db, "sensors");
export const valveStore = mongo.newCollection(db, "valves");
export const plugStore = mongo.newCollection(db, "plugs");
export const bulbStore = mongo.newCollection(db, "bulbs");
export const motionStore = mongo.newCollection(db, "motion");

export const specialsStore = mongo.newCollection(db, "specials");
export const options = { new: true, upsert: true };
