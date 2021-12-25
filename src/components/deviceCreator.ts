import { MqttClient } from "mqtt";
import { plug, heatingSensor, valve, rgbLight } from "./devices/index";

export default (client: MqttClient, deviceConfig: any, deviceType: any, io: any) => {
  switch (deviceType) {
    case "plugs":
      return new plug(client, deviceConfig, io);

    case "heatingSensors":
      return new heatingSensor(client, deviceConfig, io);

    case "valves":
      return new valve(client, deviceConfig);

    case "rgbLights":
      return new rgbLight(client, deviceConfig, io);
      break;
  }
};
