import { Radiator, offset } from "./components/devices";
import DeviceCreator from "./components/deviceCreator";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import path from "path";
import { connectToMQTT } from "./components/mqtt/mqttService";
import { startSocket } from "./components/socket/socketService";

const client = connectToMQTT();
const socket = startSocket();

//* Devices
const deviceConfig: any = load(readFileSync(path.resolve(__dirname, "./devices.yaml"), "utf-8"));
let devices: Array<any> = [];

// * Special devices
// devices.push(new Radiator(client));
devices.push(new offset(client)); //! This will need to be removed in the final version

/*
  Generate devices from the config file
*/
for (let deviceType in deviceConfig) {
  deviceConfig[deviceType].forEach((node: any) => {
    const newDevice = DeviceCreator(client, node, deviceType, socket);
    newDevice ? devices.push(newDevice) : null;
  });
}

/*
  Handle incoming messages
*/
client.on("message", (topic: String, payload: Object) => {
  // console.log(payload.toString());
  try {
    for (let i = 0; i < devices.length; i++) {
      devices[i].handleIncoming(topic, payload);
    }
  } catch (error: unknown) {
    console.log("an error", error);
  }
});
