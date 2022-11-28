import { MqttClient } from "mqtt";
import { valveStore, options, radiatorStore } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";
import { DeviceConfig } from "../";

export default class Valve {
  client: MqttClient;
  socket: Socket;
  timer: NodeJS.Timeout;
  topic: string;
  data: Data;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;
    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      valve: null,
      fan: null,
      temperature: null,
      connected: false,
    };

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: MQTTpayload = JSON.parse(rawPayload.toString());
        const { state } = payload;

        this.data = {
          ...this.data,
          valve: state,
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

interface MQTTpayload {
  node: String;
  state: boolean;
}

interface Data {
  name: string | null;
  valve: boolean | null;
  fan: boolean | null;
  temperature: number | null;
  connected: boolean | null;
}
