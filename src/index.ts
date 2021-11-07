import mqtt from "mqtt";
import { Radiator } from "./components/devices";
import { allowedDevices } from "./types";
require("dotenv").config();
import path from "path";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import DeviceCreator from "./components/deviceCreator";

const MQTT: string = process.env.MQTT ?? "";
// console.log(MQTT);

// Connect to MQTT networks
let client: mqtt.MqttClient = mqtt.connect(MQTT);

const devices: Array<any> = [];
const sensors: Array<string> = ["livingRoom", "liamsRoom", "study", "ourRoom"];

/*
  This app needs to know whether its running connected to the simulator or the production network
  instead of having a seperate object for the sun, floodlight and radiator, make them all the same onject as theyre all the same phisical device
  maybe treat the speaker relay as a plug too
*/

// Devices that are being monitored
// devices.push(new Floodlight(client));
// devices.push(new Sun(client));
devices.push(new Radiator(client));
// devices.push(new Sensors(client, sensors));

const deviceConfig: any = load(readFileSync(path.resolve(__dirname, "./devices.yaml"), "utf-8"));

deviceConfig.forEach((node: any) => {
  devices.push(DeviceCreator(client, node));
});

client.subscribe("#", (error: Error) => {
  if (error) console.log(error);
  else console.log(`📡 Listening to ${process.env.MQTT ?? ""}`);
});

client.on("message", (topic: String, payload: Object) => {
  try {
    for (let i = 0; i < devices.length; i++) {
      devices[i].handleIncoming(topic, payload);
    }
  } catch (error: unknown) {
    console.log(error);
  }
});
