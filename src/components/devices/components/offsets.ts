import { MqttClient } from "mqtt";
import { offsetStore, options, sensorStore } from "../../database";

export default class Offsets {
  client: MqttClient;
  topic: String;

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Room Offsets";
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === "Room Offsets") {
      const payload = JSON.parse(rawPayload.toString());

      for (const room in payload) {
        await sensorStore.findOneAndUpdate({ room }, { $set: { offset: payload[room] } });
      }
    }
  }
}
