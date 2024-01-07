import { MqttClient } from "mqtt";
import { plugStore, options } from "../../../database";
import { disconnectWatchdog } from "../../../helpers";
import { Socket } from "socket.io";
import { DeviceConfig } from "../..";

export default class InnrPlug {
  // timer: NodeJS.Timeout;
  client: MqttClient;
  data: Data;
  topic: string;
  socket: Socket;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;
    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      state: null,
      connected: null,
    };

    // this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: PayloadData = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          state: payload.state === "ON" ? true : false,
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
      await plugStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
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

interface Data {
  name: string | null;
  state: boolean | null;
  connected: boolean | null;
}

interface PayloadData {
  node: String;
  state: string;
}
