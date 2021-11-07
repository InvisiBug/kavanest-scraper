import { MqttClient } from "mqtt";
import { plug } from "./devices/index";

export default (client: MqttClient, deviceConfig: any) => {
  switch (deviceConfig.type) {
    case "plug":
      return new plug(client, deviceConfig);
      break;

    case "moon":
      console.log("moon");
  }
  console.log(deviceConfig.type);
};
