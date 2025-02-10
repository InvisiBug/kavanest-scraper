import { MqttClient } from "mqtt";
import {
  plug,
  valve,
  rgbLight,
  computerAudio,
  Radiator,
  zigbeeSensor,
  zigbeePlug,
  zigbeeRGBStrip,
  zigbeeBulb,
  zigbeeMotionSensor,
} from "./devices/index";
import { Socket } from "socket.io";

export default (client: MqttClient, deviceConfig: { name: string; topic: string }, deviceType: string, socket: any) => {
  switch (deviceType) {
    // Wifi devices
    case "plugs":
      return new plug(client, deviceConfig, socket);

    case "valves":
      return new valve(client, deviceConfig, socket);

    case "rgbLights":
      return new rgbLight(client, deviceConfig, socket);

    case "radiators":
      return new Radiator(client, deviceConfig, socket);

    case "specials":
      return new computerAudio(client, deviceConfig, socket);

    // Zigbee devices
    case "zigbeeSensors":
      return new zigbeeSensor(client, deviceConfig, socket);

    case "zigbeePlugs":
      return new zigbeePlug(client, deviceConfig, socket);

    case "zigbeeRGBStrips":
      return new zigbeeRGBStrip(client, deviceConfig, socket);

    case "zigbeeMotionSensors":
      return new zigbeeMotionSensor(client, deviceConfig, socket);
  }
};
