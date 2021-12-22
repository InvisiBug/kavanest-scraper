import { MqttClient } from "mqtt";
import { plugStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";

export default class Plug {
  client: MqttClient;
  timer: NodeJS.Timeout;
  topic: string;
  name: string;
  io: Socket;
  mongoID: string = "";

  data: plugData = {
    name: null,
    state: null,
    connected: null,
    _id: null,
  };

  constructor(client: MqttClient, deviceConfig: any, io: any) {
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
          state: payload.state,
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

const writeToMongo = async (data: plugData) => {
  let id: string = "";

  await plugStore
    .findOneAndUpdate(
      { name: data.name },
      {
        $set: {
          state: data.state,
          connected: data.connected,
        },
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
  state: boolean;
}
interface plugData {
  name: string | null;
  state: boolean | null;
  connected: boolean | null;
  _id: string | null;
}
