import { MqttClient } from "mqtt";
import { valveStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";

export default class Valve {
  client: MqttClient;
  socket: Socket;
  timer: NodeJS.Timeout;
  topic: string;

  data: valveData = {
    room: null,
    state: null,
    connected: null,
  };

  constructor(client: MqttClient, deviceConfig: any, socket: Socket) {
    this.client = client;
    this.socket = socket;

    this.data.room = deviceConfig.name;
    this.topic = deviceConfig.topic;

    this.data.connected = false;
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
  writeToMongo = async (data: valveData) => {
    await valveStore.findOneAndUpdate({ room: data.room }, { $set: data }, options).then((mongoDoc) => {
      if (mongoDoc.value) {
        if (Object(mongoDoc).constructor !== Promise) {
          const id = mongoDoc.value._id.toString();
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

interface valveData {
  room: string | null;
  state: boolean | null;
  connected: boolean | null;
}
