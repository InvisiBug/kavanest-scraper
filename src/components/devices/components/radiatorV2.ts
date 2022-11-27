import { MqttClient } from "mqtt";
import { radiatorStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";
import { DeviceConfig } from "../";

interface MongoData {
  name: string | null;
  valve: boolean | null;
  fan: boolean | null;
  temperature: number | null;
  connected: boolean | null;
}

interface PayloadData {
  temperature: number;
  valve: boolean;
  fan: boolean;
}

export default class RadiatorV2 {
  timer: NodeJS.Timeout;
  client: MqttClient;
  topic: String;
  socket: Socket;
  data: MongoData;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;
    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      valve: null,
      fan: null,
      temperature: null,
      connected: null,
    };

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: PayloadData = JSON.parse(rawPayload.toString());
        console.log(payload);

        const { valve, temperature, fan } = payload;

        this.data = {
          ...this.data,
          fan,
          valve,
          temperature,
          connected: true,
        };

        this.writeToMongo(this.data);

        clearTimeout(this.timer);

        this.timer = disconnectWatchdog(this.data, `${this.data.name} radiator disconnected`, this.writeToMongo);
      } catch (error) {
        console.log(`${this.data.name} radiator disconnected`);
      }
    }
  }

  writeToMongo = async (data: MongoData) => {
    try {
      await radiatorStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
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
