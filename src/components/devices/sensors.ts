import { MqttClient } from "mqtt";
import { SensorStore, options } from "../database";

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

  offset: number = 0;
  id: string = "";

  constructor(id: string) {
    this.id = id;
  }

  async handleIncoming({ node, temperature, humidity, pressure }: any) {
    const room = this.camelRoomName(node);

    if (room.includes(this.id)) {
      const data = { room: this.id, temperature, humidity, pressure };
      await SensorStore.findOneAndUpdate({ room: this.id }, data, options);
    }
  }

  camelRoomName(text: string) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    return text.substr(0, 1).toLowerCase() + text.substr(1);
  }
}
