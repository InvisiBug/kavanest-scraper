import { MqttClient } from "mqtt";
import { disconnectWatchdog, camelRoomName } from "../../helpers";
import { sensorStore, options } from "../../database";
import { Socket } from "socket.io";
import { DeviceConfig } from "../";

export default class heatingSensor {
  timer: NodeJS.Timeout;
  client: MqttClient;
  socket: Socket;
  topic: string;
  data: Data;

  offset: number = 0;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;
    this.topic = deviceConfig.topic;

    this.data = {
      room: deviceConfig.name,
      rawTemperature: null,
      temperature: null,
      humidity: null,
      connected: false,
    };

    this.timer = disconnectWatchdog(this.data, "sensor disconnect", this.writeToMongo);
  }

  async handleIncoming(topic: string, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: PayloadData = JSON.parse(rawPayload.toString());
        console.log(topic);

        this.data = {
          ...this.data,
          rawTemperature: payload.temperature,
          temperature: parseFloat((payload.temperature + (await getOffsets(this.data.room))).toFixed(2)),
          humidity: payload.humidity,
          connected: true,
        };

        this.writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.room} sensor disconnected`, this.writeToMongo);
      } catch (error) {
        console.log(`${this.data.room} sensor disconnected`);
      }
    }
  }

  writeToMongo = async (data: Data) => {
    await sensorStore.findOneAndUpdate({ room: data.room }, { $set: data }, options).then(async (mongoDoc) => {
      if (mongoDoc.value) {
        if (Object(mongoDoc).constructor !== Promise) {
          const id: string = mongoDoc.value._id.toString();
          this.socket.emit(id, {
            ...data,
            _id: id,
            offset: await getOffsets(this.data.room),
          });
        }
      }
    });
  };
}

const getOffsets = async (room: string) => {
  try {
    const sensorData: any = await sensorStore.findOne({ room });
    if (sensorData.offset) {
      return sensorData.offset;
    } else {
      return 0;
    }
  } catch (error) {
    // console.log("Sensor object doesnt exist");
    return 0;
  }
};

interface Data {
  room: string;
  rawTemperature: number | null;
  temperature: number | null;
  humidity: number | null;
  connected: Boolean | null;
}

interface PayloadData {
  temperature: number;
  humidity: number;
}
