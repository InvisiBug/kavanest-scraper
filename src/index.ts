import { Radiator, offset } from "./components/devices";
import DeviceCreator from "./components/deviceCreator";
import { mqttUrl } from "./components/helpers";
import { createServer } from "http";
import { Server } from "socket.io";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import mqtt from "mqtt";
import path from "path";
import { connectToMQTT } from "./components/mqtt/mqttService";
import { startSocket } from "./components/socket/socketService";

/////////////
//* Socket Stuff
// const socketServer = createServer();

// const socket = new Server(socketServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// socketServer.listen(3100);

// socket.on("connection", () => {});

// const socketServer = createServer();

// const io = new Server(socketServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// socketServer.listen(3100);

// io.on("connection", () => {
//   console.log("Hello socket");
// });

const client = connectToMQTT();
const io = startSocket();

client.on("message", (topic: String, payload: Object) => {
  try {
    // console.log(topic, JSON.parse(payload.toString()));
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
    const newDevice = DeviceCreator(client, node, deviceType, io);
    newDevice ? devices.push(newDevice) : null;
  });
}
