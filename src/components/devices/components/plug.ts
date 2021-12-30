import { MqttClient } from "mqtt";
import { plugStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";

export default class Plug {
  timer: NodeJS.Timeout;
  client: MqttClient;
  data: plugData;
  topic: string;
  socket: Socket;

  constructor(client: MqttClient, deviceConfig: any, socket: Socket) {
    this.client = client;
    this.socket = socket;

    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      state: null,
      connected: null,
    };

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: MQTTpalyoad = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          state: payload.state,
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

  writeToMongo = async (data: plugData) => {
    await plugStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
      if (mongoDoc.value) {
        if (Object(mongoDoc).constructor !== Promise) {
          const id = mongoDoc.value._id.toString();
          this.socket.emit(id, { ...data, _id: id });
        }
      }
    });
  };
}

interface MQTTpalyoad {
  node: String;
  state: boolean;
}
interface plugData {
  name: string | null;
  state: boolean | null;
  connected: boolean | null;
}
