import mqtt from "mqtt";
import { Floodlight, Radiator, Sun, Sensors } from "./components/devices";
import { allowedDevices } from "./components/types";
require("dotenv").config();

const MQTT: string = process.env.MQTT ?? "";
console.log(MQTT);

// Connect to MQTT networks
let client: mqtt.MqttClient = mqtt.connect(MQTT);

const devices: Array<any> = [];
const sensors: Array<string> = ["livingRoom", "kitchen", "liamsRoom", "study", "ourRoom"];

/*
  This app needs to know whether its running connected to the simulator or the production network
  instead of having a seperate object for the sun, floodlight and radiator, make them all the same onject as theyre all the same phisical device
  maybe treat the speaker relay as a plug too

*/

// Devices that are being monitored
devices.push(new Floodlight(client));
devices.push(new Sun(client));
devices.push(new Radiator(client));
devices.push(new Sensors(client, sensors));

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
