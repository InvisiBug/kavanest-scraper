import { MqttClient } from "mqtt";
import { plug, heatingSensor, valve, rgbLight } from "./devices/index";

export default (client: MqttClient, deviceConfig: any) => {
  switch (deviceConfig.type) {
    case "plug":
      return new plug(client, deviceConfig);

    case "heatingSensor":
      return new heatingSensor(client, deviceConfig);

    case "valve":
      return new valve(client, deviceConfig);

    case "rgbLight":
      return new rgbLight(client, deviceConfig);
      break;
  }
  console.log(deviceConfig.type);
};
