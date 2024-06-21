import { MqttClient } from "mqtt";
import { bulbStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";
import { DeviceConfig } from "..";

export default class ZigbeeBulb {
  timer: NodeJS.Timeout;
  client: MqttClient;
  socket: Socket;
  topic: string;
  data: any;
  name: string;
  room: string | undefined;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    console.log("Here");
    this.client = client;
    this.socket = socket;

    this.topic = deviceConfig.topic;
    this.room = deviceConfig.room;
    this.name = deviceConfig.name;

    this.data = {} as any;

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const { brightness, state, linkquality, color_mode, color_temp }: any = JSON.parse(rawPayload.toString());

        this.data = {
          brightness,
          state: state === "ON" ? true : false,
          linkquality,
          name: this.name,
          room: this.room,
          colour_mode: color_mode === "color_temp" ? "colour_temp" : color_mode,
          colour_temp: color_temp,
          type: "zigbeeBulb",
          connected: true,
        };

        console.log(this.data);

        this.writeToMongo(this.data);
        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
      } catch (error) {
        console.log(`${this.data.name} disconnected`);
      }
    }
  }

  writeToMongo = async (data: Data) => {
    try {
      await bulbStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
        if (mongoDoc.value) {
          if (Object(mongoDoc).constructor !== Promise) {
            const id: string = mongoDoc.value._id.toString();
            this.socket.emit(id, { ...data, _id: id });
          }
        }
      });
    } catch (error) {
      console.log("Mongo Connection Dropped, Restarting ...");
      console.log(error);
      process.exit();
    }
  };
}

interface MQTTPayload {
  brightness: number;
  linkquality: number;
  state: "OFF" | "ON" | boolean;
}

export interface Data extends MQTTPayload {
  connected: boolean;
  room: string | undefined;
  state: boolean;
  name: string;
  red: number;
  green: number;
  blue: number;
  _id?: string | null;
}
