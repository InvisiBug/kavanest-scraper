import { MqttClient } from "mqtt";
import { plugStore, options } from "../../database";
import { disconnectWatchdog } from "../../helpers";
import { Socket } from "socket.io";

export default class Plug {
  client: MqttClient;
  io: Socket;
  topic: string;
  data: plugData;
  timer: NodeJS.Timeout;
  mongoID: string = "";

  constructor(client: MqttClient, deviceConfig: any, io: Socket) {
    this.client = client;
    this.io = io;

    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      state: null,
      connected: null,
      _id: null,
    };

    this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: MQTTpalyoad = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          state: payload.state,
          connected: true,
          _id: this.mongoID,
        };

        writeToMongo(this.data).then((id) => {
          this.mongoID = id;
        });

        this.io.emit(this.mongoID, this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.name} disconnected`, writeToMongo);
      } catch (error) {
        console.log(`${this.data.name} disconnected`);
      }
    }
  }
}

const writeToMongo = async (inData: plugData) => {
  let id: string = "";
  const data = { ...inData }; //* Original gets modified when using delete so make a copy
  delete data["_id"];

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
  _id?: string | null;
}
