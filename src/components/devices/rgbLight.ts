import { MqttClient } from "mqtt";
import { rgbLightStore, options } from "../database";
import { disconnectWatchdog } from "../helpers";
import { rgbLightData } from "../../types";

export default class RGBLight {
  client: MqttClient;
  timer: NodeJS.Timeout;
  topic: string;
  name: string;

  data: rgbLightData = {
    name: null,
    red: null,
    green: null,
    blue: null,
    mode: null,
    connected: false,
  };

  constructor(client: MqttClient, deviceConfig: any) {
    this.client = client;

    this.name = deviceConfig.name;
    this.topic = deviceConfig.topic;

    this.data.connected = false;
    this.timer = disconnectWatchdog(this.data, `${this.name} disconnected`, writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: MQTTpalyoad = JSON.parse(rawPayload.toString());
        this.data = {
          name: this.name,
          red: payload.red,
          green: payload.green,
          blue: payload.blue,
          mode: payload.mode,
          connected: true,
        };

        writeToMongo(this.data);
        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.name} disconnected`, writeToMongo);
      } catch (error) {
        console.log(`${this.name} disconnected`);
      }
    }
  }
}

const writeToMongo = async (data: rgbLightData) => {
  await rgbLightStore.findOneAndUpdate(
    { name: data.name },
    {
      $set: { ...data },
    },
    options,
  );
};

interface MQTTpalyoad {
  node: String;
  red: number;
  green: number;
  blue: number;
  mode: number;
}
