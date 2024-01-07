import { MqttClient } from "mqtt";
import { specialsStore, options } from "src/components/database";
import { disconnectWatchdog } from "src/components/helpers";
import { Socket } from "socket.io";
import { DeviceConfig } from "src/components/devices";

export default class ComputerAudio {
  timer: NodeJS.Timeout;
  client: MqttClient;
  socket: Socket;
  topic: string;
  data: Data;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;
    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      room: deviceConfig.room,
      left: null,
      right: null,
      sub: null,
      mixer: null,
      connected: null,
    };

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: PayloadData = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          left: payload.Left,
          right: payload.Right,
          sub: payload.Sub,
          mixer: payload.Mixer,
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
      await specialsStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
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
  name: string;
  room: string | undefined;
  left: boolean | null;
  right: boolean | null;
  sub: boolean | null;
  mixer: boolean | null;
  connected: boolean | null;
}

interface PayloadData {
  Left: boolean | null;
  Right: boolean | null;
  Sub: boolean | null;
  Mixer: boolean | null;
  Connected: boolean | null;
}
