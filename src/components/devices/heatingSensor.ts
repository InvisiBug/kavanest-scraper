import { MqttClient } from "mqtt";
import { disconnectWatchdog, camelRoomName } from "../helpers";
import { sensorStore, options } from "../database";

export default class heatingSensor {
  temperature: number | null = null;
  humidity: number | null = null;
  pressure: number | null = null;
  timer: NodeJS.Timeout;
  client: MqttClient;
  topic: string;

  data: sensorData = {
    room: "",
    rawTemperature: null,
    temperature: null,
    humidity: null,
    connected: false,
  };

  offset: number = 0;

  constructor(client: MqttClient, deviceConfig: any) {
    this.client = client;

    this.data.room = deviceConfig.name;
    this.topic = deviceConfig.topic;

    this.timer = disconnectWatchdog(this.data, "sensor disconnect", writeToMongo);
  }

  async handleIncoming(topic: string, rawPayload: any) {
    if (topic === this.topic) {
      try {
        const payload = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          rawTemperature: payload.temperature,
          temperature: (payload.temperature + (await getOffsets(this.data.room))).toFixed(2),
          humidity: payload.humidity,
          connected: true,
        };

        writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.room} sensor disconnected`, writeToMongo);
      } catch (error) {
        console.log(`${this.data.room} sensor disconnected`);
      }
    }
  }
}

const writeToMongo = async (data: sensorData) => {
  await sensorStore.findOneAndUpdate({ room: data.room }, { $set: data }, options);
};

const getOffsets = async (room: string) => {
  // try {
  //   const test: any = await offsetStore.findOne({ name: "roomOffsets" });
  //   return test[room];
  // } catch {
  //   return 0;
  // }
  return 0;
};

interface sensorData {
  room: string;
  rawTemperature: number | null;
  temperature: number | null;
  humidity: number | null;
  connected: Boolean | null;
}
