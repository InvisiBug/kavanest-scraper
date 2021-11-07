import { MqttClient } from "mqtt";
import { disconnectWatchdog, camelRoomName } from "../helpers";
import { sensorStore, options } from "../database";

export default class heatingSensor {
  temperature: number | undefined = undefined;
  humidity: number | undefined = undefined;
  pressure: number | undefined = undefined;
  timer: NodeJS.Timeout;
  client: MqttClient;
  topic: string;

  data: sensorData = {
    room: null,
    temperature: null,
    humidity: null,
    connected: null,
  };

  offset: number = 0;
  room: string = "";

  constructor(client: MqttClient, deviceConfig: any) {
    this.client = client;

    this.data.room = deviceConfig.name;
    this.topic = deviceConfig.topic;

    this.data.connected = false;
    this.timer = disconnectWatchdog(this.data, "sensor disconnect", writeToMongo);
  }

  handleIncoming(topic: string, rawPayload: any) {
    if (topic === this.topic) {
      try {
        const payload = JSON.parse(rawPayload.toString());
        this.data = {
          ...this.data,
          temperature: payload.temperature,
          humidity: payload.humidity,
          connected: true,
        };

        writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.room} sensor disconnected`, writeToMongo);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const writeToMongo = async (data: sensorData) => {
  await sensorStore.findOneAndUpdate({ room: data.room }, data, options);
};

interface sensorData {
  room: string | null;
  temperature: number | null;
  humidity: number | null;
  connected: Boolean | null;
}
