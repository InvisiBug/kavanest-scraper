import { MqttClient } from "mqtt";
import { rgbLightStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";

export default class RGBLight {
  client: MqttClient;
  timer: NodeJS.Timeout;
  topic: string;
  name: string;
  io: Socket;
  mongoID: string = "";

  data: rgbLightData = {
    name: null,
    red: null,
    green: null,
    blue: null,
    mode: null,
    connected: false,
    _id: null,
  };

  constructor(client: MqttClient, deviceConfig: any, io: Socket) {
    this.client = client;
    this.io = io;

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
          _id: this.mongoID,
        };

        writeToMongo(this.data).then((id) => {
          this.mongoID = id;
        });

        this.io.emit(this.mongoID, this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.name} disconnected`, writeToMongo);
      } catch (error) {
        console.log(`${this.name} disconnected`);
      }
    }
  }
}

const writeToMongo = async (data: rgbLightData) => {
  let id: string = "";

  await rgbLightStore
    .findOneAndUpdate(
      { name: data.name },
      {
        $set: { ...data },
      },
      options,
    )
    .then((mongoDoc) => {
      if (mongoDoc.value) {
        if (Object(mongoDoc).constructor !== Promise) {
          id = mongoDoc.value._id.toString();
        }
      }
    });

  return id;
};

interface MQTTpalyoad {
  node: String;
  red: number;
  green: number;
  blue: number;
  mode: number;
}

interface rgbLightData {
  name: string | null;
  red: number | null;
  green: number | null;
  blue: number | null;
  mode: number | null;
  connected: boolean;
  _id: string | null;
}
