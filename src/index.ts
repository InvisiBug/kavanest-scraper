import { Radiator, offset } from "./components/devices";
import DeviceCreator from "./components/deviceCreator";
import { mqttUrl } from "./components/helpers";
import { createServer } from "http";
import { Server } from "socket.io";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import mqtt from "mqtt";
import path from "path";
require("dotenv").config();

/////////////
//* Socket Stuff
const socketServer = createServer();

const io = new Server(socketServer, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"],
  },
});
socketServer.listen(80);

io.on("connection", () => {});

/////////////
//*  MQTT Stuff
const MQTT: string = mqttUrl;
let client: mqtt.MqttClient = mqtt.connect(MQTT);

client.subscribe("#", (error: Error) => {
  if (error) console.log(error);
  else console.log(`📡 Listening to ${mqttUrl}`);
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

////////
//* Devices
const deviceConfig: any = load(readFileSync(path.resolve(__dirname, "./devices.yaml"), "utf-8"));
let devices: Array<any> = [];

// * Special devices
devices.push(new Radiator(client));
devices.push(new offset(client)); //! This will need to be removed in the final version

for (let deviceType in deviceConfig) {
  deviceConfig[deviceType].forEach((node: any) => {
    devices.push(DeviceCreator(client, node, deviceType, io));
  });
}
