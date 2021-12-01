import Mongo from "./mongo";

const db = "devices";

export const rgbLightStore = new Mongo(db, "rgbLights").collection;
export const radiatorStore = new Mongo(db, "radiators").collection;
export const offsetStore = new Mongo(db, "offsets").collection;
export const sensorStore = new Mongo(db, "sensors").collection;
export const valveStore = new Mongo(db, "valves").collection;
export const plugStore = new Mongo(db, "plugs").collection;

export const options = { new: true, upsert: true };
