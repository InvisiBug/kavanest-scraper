import Mongo from "./mongo";

const db = "mongo2";
export const options = { new: true, upsert: true };

export const radiatorStore = new Mongo(db, "radiators").collection;
export const offsetStore = new Mongo(db, "offsets").collection;
export const sensorStore = new Mongo(db, "sensors").collection;
export const valveStore = new Mongo(db, "valves").collection;
export const plugStore = new Mongo(db, "plugs").collection;
export const rgbLightStore = new Mongo(db, "rgbLight").collection;
