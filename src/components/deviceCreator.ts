import { MqttClient } from "mqtt";
import { plug, heatingSensor, valve, rgbLight, computerAudio, Radiator, radiatorV2 } from "./devices/index";
import { Socket } from "socket.io";

export default (client: MqttClient, deviceConfig: { name: string; topic: string }, deviceType: string, socket: any) => {
  switch (deviceType) {
    case "plugs":
      return new plug(client, deviceConfig, socket);

    case "heatingSensors":
      return new heatingSensor(client, deviceConfig, socket);

    case "valves":
      return new valve(client, deviceConfig, socket);

    case "rgbLights":
      return new rgbLight(client, deviceConfig, socket);

    case "radiators":
      return new radiatorV2(client, deviceConfig, socket);

    case "specials":
      return new computerAudio(client, deviceConfig, socket);
  }
};
