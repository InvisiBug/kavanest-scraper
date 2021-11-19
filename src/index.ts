import { Radiator, offset } from "./components/devices";
import DeviceCreator from "./components/deviceCreator";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import mqtt from "mqtt";
import path from "path";
require("dotenv").config();

const MQTT: string = process.env.MQTT ?? "";

// Connect to MQTT networks
let client: mqtt.MqttClient = mqtt.connect(MQTT);

const devices: Array<any> = [];

//? Initial device configuration
/*
  This app needs to know whether its running connected to the simulator or the production network
  instead of having a seperate object for the sun, floodlight and radiator, make them all the same onject as theyre all the same phisical device
  maybe treat the speaker relay as a plug too
*/
// * Special devices
devices.push(new Radiator(client));
devices.push(new offset(client)); //! This will need to be removed in the final version

//* Config'd devices
const deviceConfig: any = load(readFileSync(path.resolve(__dirname, "./devices.yaml"), "utf-8"));

deviceConfig.forEach((node: any) => {
  devices.push(DeviceCreator(client, node));
});

//? MQTT messages
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
