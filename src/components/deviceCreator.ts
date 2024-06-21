import { MqttClient } from "mqtt";
import { plug, valve, rgbLight, computerAudio, Radiator, zigbeeSensor, zigbeePlug, zigbeeRGBStrip, zigbeeBulb } from "./devices/index";
import { Socket } from "socket.io";

export default (client: MqttClient, deviceConfig: { name: string; topic: string }, deviceType: string, socket: any) => {
  switch (deviceType) {
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

    case "zigbeeSensors":
      return new zigbeeSensor(client, deviceConfig, socket);

    case "zigbeePlugs":
      return new zigbeePlug(client, deviceConfig, socket);

    case "zigbeeRGBStrips":
      return new zigbeeRGBStrip(client, deviceConfig, socket);

    case "zigbeeBulbs":
      return new zigbeeBulb(client, deviceConfig, socket);
  }
};
