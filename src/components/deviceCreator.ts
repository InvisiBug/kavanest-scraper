import { MqttClient } from "mqtt";
import { plug, heatingSensor, valve, rgbLight, computerAudio } from "./devices/index";

export default (client: MqttClient, deviceConfig: any, deviceType: any, socket: any) => {
  switch (deviceType) {
    case "plugs":
      return new plug(client, deviceConfig, socket);

    case "heatingSensors":
      return new heatingSensor(client, deviceConfig, socket);

    case "valves":
      return new valve(client, deviceConfig);

    case "rgbLights":
      return new rgbLight(client, deviceConfig, socket);

    case "specials":
      console.log("Specials");
      return new computerAudio(client, deviceConfig, socket);
    // new console.log("special");
    // break;
  }
};
