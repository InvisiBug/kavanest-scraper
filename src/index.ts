import mqtt from "mqtt";
import { Floodlight, Sun } from "./components/devices";

// Connect to MQTT networks
let client: mqtt.MqttClient = mqtt.connect("mqtt://kavanet.io");
// let intClient: mqtt.MqttClient;

const floodlight = new Floodlight(client);
const sun = new Sun(client);

client.subscribe("#", (error: Error) => {
  if (error) console.log(error);
  else console.log("Subscribed to all");
});

client.on("message", (topic: String, payload: object) => {
  // console.log(payload.toString());
  floodlight.handleIncoming(topic, payload);
  sun.handleIncoming(topic, payload);
});
