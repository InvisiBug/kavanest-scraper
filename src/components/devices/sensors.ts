import { MqttClient } from "mqtt";
import { SensorStore, options } from "../database";
import { camelRoomName, disconnectWatchdog } from "../helpers";
import { sensorData } from "../types";

export default class Sensors {
  client: MqttClient;
  sensors: Array<sensor> = [];

  constructor(client: MqttClient, sensors: Array<string>) {
    this.client = client;

    for (let i = 0; i < sensors.length; i++) {
      this.sensors.push(new sensor(sensors[i]));
    }
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic.includes("Sensor")) {
      const payload = JSON.parse(rawPayload.toString());

      for (let i = 0; i < this.sensors.length; i++) {
        this.sensors[i].handleIncoming(payload);
      }
    }
  }
}

class sensor {
  temperature: number | undefined = undefined;
  humidity: number | undefined = undefined;
  pressure: number | undefined = undefined;
  timer: NodeJS.Timeout;

  data: sensorData = {
    room: null,
    temperature: null,
    humidity: null,
    connected: null,
  };

  offset: number = 0;
  room: string = "";

  constructor(room: string) {
    this.room = room;
    this.data.room = room;
    this.timer = disconnectWatchdog(this.data, "sensor disconnect", writeToMongo);
  }

  async handleIncoming({ node, temperature, humidity, pressure }: any) {
    const room = camelRoomName(node);

    if (room.includes(this.room)) {
      // const data = { room: this.room, temperature, humidity, pressure };
      this.data = {
        ...this.data,
        temperature,
        humidity,
        connected: true,
      };

      // console.log(this.data);
      writeToMongo(this.data);

      clearTimeout(this.timer);
      this.timer = disconnectWatchdog(this.data, `${room} sensor disconnected`, writeToMongo);
    }
  }
}

const writeToMongo = async (data: sensorData) => {
  await SensorStore.findOneAndUpdate({ room: data.room }, data, options);
};
