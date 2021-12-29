import { MqttClient } from "mqtt";
import { disconnectWatchdog, camelRoomName } from "../../helpers";
import { sensorStore, options } from "../../database";
import { Socket } from "socket.io";

export default class heatingSensor {
  timer: NodeJS.Timeout;
  client: MqttClient;
  topic: string;
  mongoID: string = "";
  io: Socket;
  room: string;

  data: any = {
    room: "",
    rawTemperature: null,
    temperature: null,
    humidity: null,
    connected: false,
    _id: null,
  };

  offset: number = 0;

  constructor(client: MqttClient, deviceConfig: any, io: any) {
    this.client = client;
    this.io = io;

    this.room = deviceConfig.name;
    this.topic = deviceConfig.topic;

    this.timer = disconnectWatchdog(this.data, "sensor disconnect", writeToMongo);
  }

  async handleIncoming(topic: string, rawPayload: any) {
    if (topic === this.topic) {
      try {
        const payload = JSON.parse(rawPayload.toString());

        this.data = {
          room: this.room,
          rawTemperature: payload.temperature,
          temperature: parseFloat((payload.temperature + (await getOffsets(this.data.room))).toFixed(2)),
          humidity: payload.humidity,
          connected: true,
          _id: this.mongoID,
        };

        writeToMongo(this.data).then((id) => {
          this.mongoID = id;
        });

        this.io.emit(this.mongoID, {
          ...this.data,
          offset: await getOffsets(this.data.room),
        });

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.room} sensor disconnected`, writeToMongo);
      } catch (error) {
        console.log(`${this.data.room} sensor disconnected`);
      }
    }
  }
}

const writeToMongo = async (inData: any) => {
  const data = { ...inData }; //* Original gets modified when using delete so make a copy
  delete data["_id"];

  let id: string = "";

  await sensorStore.findOneAndUpdate({ room: data.room }, { $set: data }, options).then((mongoDoc) => {
    if (mongoDoc.value) {
      if (Object(mongoDoc).constructor !== Promise) {
        id = mongoDoc.value._id.toString();
      }
    }
  });

  return id;
};

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

interface sensorData {
  room: string;
  rawTemperature: number | null;
  temperature: number | null;
  humidity: number | null;
  connected: Boolean | null;
}
