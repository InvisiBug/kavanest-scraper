import { MqttClient } from "mqtt";
import { plug, heatingSensor, valve } from "./devices/index";

export default (client: MqttClient, deviceConfig: any) => {
  switch (deviceConfig.type) {
    case "plug":
      return new plug(client, deviceConfig);

    case "heatingSensor":
      return new heatingSensor(client, deviceConfig);

    case "valve":
      return new valve(client, deviceConfig);
  }
  console.log(deviceConfig.type);
};
