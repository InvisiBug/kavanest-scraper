import mqtt from "mqtt";
import { Radiator, offset } from "./components/devices";
import { allowedDevices } from "./types";
require("dotenv").config();
import path from "path";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import DeviceCreator from "./components/deviceCreator";
import { connectToDB, events } from "./components/dbTest";
// import Mongoose, { connection } from "./components/mongoose";
// import { testStore } from "./components/mongoose";

import { mongo } from "./components/dbTest";

const test = new mongo();

const testStore = test.collection;

testStore.findOneAndUpdate({ a: 1 }, { $set: { a: 2 } }, { upsert: true });
// testStore.store.findOneAndUpdate({ a: 1 }, { $set: { a: 2 } }, { upsert: true });

// const MQTT: string = process.env.MQTT ?? "";

// // Connect to MQTT networks
// let client: mqtt.MqttClient = mqtt.connect(MQTT);

// const devices: Array<any> = [];

// // connectToDB(process.env.URI ?? "", "newDatabase", "test");

// //? Initial device configuration
// /*
//   This app needs to know whether its running connected to the simulator or the production network
//   instead of having a seperate object for the sun, floodlight and radiator, make them all the same onject as theyre all the same phisical device
//   maybe treat the speaker relay as a plug too
// */
// // * Special devices
// devices.push(new Radiator(client));
// devices.push(new offset(client)); //! This will need to be removed in the final version

// //* Config'd devices
// const deviceConfig: any = load(readFileSync(path.resolve(__dirname, "./devices.yaml"), "utf-8"));

// deviceConfig.forEach((node: any) => {
//   devices.push(DeviceCreator(client, node));
// });

// //? MQTT messages
// client.subscribe("#", (error: Error) => {
//   if (error) console.log(error);
//   else console.log(`📡 Listening to ${process.env.MQTT ?? ""}`);
// });

// client.on("message", (topic: String, payload: Object) => {
//   // if (events) {
//   // events.findOneAndUpdate({ a: 1 }, { $set: { a: 2 } }, { upsert: true });
//   // }
//   // connection.findOneAndUpdate({ a: 1 }, { $set: { a: 2 } }, { upsert: true });
//   try {
//     for (let i = 0; i < devices.length; i++) {
//       devices[i].handleIncoming(topic, payload);
//     }
//   } catch (error: unknown) {
//     console.log(error);
//   }
// });

// // connectToDB(process.env.URI ?? "", "newDatabase", "test");

// // (async () => {
// //   // if (events) {
// //   // events.findOneAndUpdate({ a: 1 }, { $set: { a: 2 } }, { upsert: true });
// //   // }
// //   const test = Mongoose.FilesCollection;
// //   if (test) {
// //     await test.findOneAndUpdate({ a: 1 }, { $set: { a: 1 } }, { upsert: true });
// //   }
// // })();
