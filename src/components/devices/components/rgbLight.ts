import { MqttClient } from "mqtt";
import { rgbLightStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";
import { DeviceConfig } from "../";

export default class RGBLight {
  timer: NodeJS.Timeout;
  client: MqttClient;
  socket: Socket;
  topic: string;
  data: Data;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;

    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      red: null,
      green: null,
      blue: null,
      mode: null,
      connected: false,
    };

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: MQTTpalyoad = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          red: payload.red,
          green: payload.green,
          blue: payload.blue,
          mode: payload.mode,
          connected: true,
        };

        this.writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
      } catch (error) {
        console.log(`${this.data.name} disconnected`);
      }
    }
  }

  writeToMongo = async (data: Data) => {
    await rgbLightStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
      if (mongoDoc.value) {
        if (mongoDoc.value) {
          if (Object(mongoDoc).constructor !== Promise) {
            const id: string = mongoDoc.value._id.toString();
            this.socket.emit(id, { ...data, _id: id });
          }
        }
      }
    });
  };
}

interface MQTTpalyoad {
  node: String;
  red: number;
  green: number;
  blue: number;
  mode: number;
}

export interface Data {
  name: string | null;
  red: number | null;
  green: number | null;
  blue: number | null;
  mode: number | null;
  connected: boolean;
  _id?: string | null;
}
