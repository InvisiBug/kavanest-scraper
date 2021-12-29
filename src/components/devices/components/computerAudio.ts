import { MqttClient } from "mqtt";
import { specialsStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";

export default class ComputerAudio {
  client: MqttClient;
  io: Socket;
  topic: string;
  data: any;
  timer: NodeJS.Timeout;
  mongoID: string = "";

  constructor(client: MqttClient, deviceConfig: any, io: Socket) {
    this.client = client;
    this.io = io;

    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      left: null,
      right: null,
      sub: null,
      mixer: null,
      connected: null,
      _id: null,
    };

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: any = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          left: payload.Left,
          right: payload.Right,
          sub: payload.Sub,
          mixer: payload.Mixer,
          connected: true,
          _id: this.mongoID,
        };

        console.log(this.data);

        this.writeToMongo(this.data).then((id) => {
          this.mongoID = id;
        });

        this.io.emit(this.mongoID, this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, this.writeToMongo);
      } catch (error) {
        console.log(`${this.data.name} disconnected`);
      }
    }
  }

  writeToMongo = async (inData: plugData) => {
    let id: string = "";
    const data = { ...inData }; //* Original gets modified when using delete so make a copy
    delete data["_id"];

    await specialsStore.findOneAndUpdate({ name: data.name }, { $set: data }, options).then((mongoDoc) => {
      if (mongoDoc.value) {
        if (Object(mongoDoc).constructor !== Promise) {
          id = mongoDoc.value._id.toString();
        }
      }
    });

    // this.io.emit(id, this.data);

    return id;
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
  _id?: string | null;
}
