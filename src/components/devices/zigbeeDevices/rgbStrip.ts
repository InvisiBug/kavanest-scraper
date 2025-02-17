import { MqttClient } from "mqtt";
import { rgbLightStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";
import { DeviceConfig } from "../../devices";

export default class ZigbeeRGBStrip {
  // timer: NodeJS.Timeout;
  client: MqttClient;
  socket: Socket;
  topic: string;
  data: Data;
  name: string;
  room: string | undefined;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;

    this.topic = deviceConfig.topic;
    this.room = deviceConfig.room;
    this.name = deviceConfig.name;

    this.data = {} as Data;

    // this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  /*
    So this one is a little crazy
    Couldnt figure out how to get a reliable colour reading as its in some weird colour space
    And i think the device reports the colour wrong as all attempts at converting failed

    We rely on the colour data stored in the mongo database, not great I know but it works
    Every time the socket emits, it was using only the payload data without the colour data
  */

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      const mongoData = await rgbLightStore.findOne<Data>({ name: this.name });
      if (!mongoData) return;
      const { red, green, blue } = mongoData;

      try {
        const { brightness, state, linkquality }: MQTTPayload = JSON.parse(rawPayload.toString());

        this.data = {
          brightness,
          state: state === "ON" ? true : false,
          linkquality,
          red,
          green,
          blue,
          name: this.name,
          room: this.room,
          connected: true,
        };

        this.writeToMongo(this.data);
        // clearTimeout(this.timer);
        // this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
      } catch (error) {
        console.log(`${this.data.name} disconnected`);
      }
    }
  }

  writeToMongo = async (data: Data) => {
    try {
      await rgbLightStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
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

const HSBToRGB = (h: number, s: number, b: number) => {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};

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
