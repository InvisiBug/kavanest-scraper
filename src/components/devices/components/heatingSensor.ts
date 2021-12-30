import { MqttClient } from "mqtt";
import { disconnectWatchdog, camelRoomName } from "../../helpers";
import { sensorStore, options } from "../../database";
import { Socket } from "socket.io";

export default class heatingSensor {
  timer: NodeJS.Timeout;
  client: MqttClient;
  topic: string;
  socket: Socket;

  data: any = {
    room: "",
    rawTemperature: null,
    temperature: null,
    humidity: null,
    connected: false,
  };

  offset: number = 0;

  constructor(client: MqttClient, deviceConfig: any, socket: any) {
    this.client = client;
    this.socket = socket;

    this.data.room = deviceConfig.name;
    this.topic = deviceConfig.topic;

    this.timer = disconnectWatchdog(this.data, "sensor disconnect", this.writeToMongo);
  }

  async handleIncoming(topic: string, rawPayload: any) {
    if (topic === this.topic) {
      try {
        const payload = JSON.parse(rawPayload.toString());

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

  writeToMongo = async (data: any) => {
    await sensorStore.findOneAndUpdate({ room: data.room }, { $set: data }, options).then(async (mongoDoc) => {
      if (mongoDoc.value) {
        if (Object(mongoDoc).constructor !== Promise) {
          const id = mongoDoc.value._id.toString();
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

interface SensorData {
  room: string;
  rawTemperature: number | null;
  temperature: number | null;
  humidity: number | null;
  connected: Boolean | null;
}
