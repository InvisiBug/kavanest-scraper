import mqtt from "mqtt";
import { Floodlight, Radiator, Sun } from "./components/devices";
import { allowedDevices } from "./components/types";

// Connect to MQTT networks
let client: mqtt.MqttClient = mqtt.connect("mqtt://kavanet.io");
// let intClient: mqtt.MqttClient;

const devices: Array<allowedDevices> = [];

devices.push(new Floodlight(client));
devices.push(new Sun(client));
devices.push(new Radiator(client));

client.subscribe("#", (error: Error) => {
  if (error) console.log(error);
  else console.log("Subscribed to all");
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
