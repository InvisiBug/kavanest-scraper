import { MqttClient } from "mqtt";
import { valveStore, options } from "../../database";
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
      room: deviceConfig.name,
      state: null,
      connected: false,
    };
    this.timer = disconnectWatchdog(this.data, `${this.data.room} disconnected`, this.writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: MQTTpayload = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          state: payload.state,
          connected: true,
        };

        this.writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.room} disconnected`, this.writeToMongo);
      } catch (error) {
        console.log(`${this.data.room} disconnected`);
      }
    }
  }
  writeToMongo = async (data: Data) => {
    await valveStore.findOneAndUpdate({ room: data.room }, { $set: data }, options).then((mongoDoc) => {
      if (mongoDoc.value) {
        if (Object(mongoDoc).constructor !== Promise) {
          const id: string = mongoDoc.value._id.toString();
          this.socket.emit(id, { ...data, _id: id });
        }
      }
    });
  };
}

interface MQTTpayload {
  node: String;
  state: boolean;
}

interface Data {
  room: string | null;
  state: boolean | null;
  connected: boolean | null;
}
