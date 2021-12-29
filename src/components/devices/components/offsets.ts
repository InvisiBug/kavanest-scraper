import { MqttClient } from "mqtt";
import { sensorStore } from "../../database";
import { camelRoomName } from "../../utils";

export default class Offsets {
  client: MqttClient;
  topic: String;

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Room Offsets";
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      const payload = JSON.parse(rawPayload.toString());
      console.log(payload);

      for (var room in payload) {
        await sensorStore.findOneAndUpdate({ room: camelRoomName(room) }, { $set: { offset: payload[room] } });
      }
    }
  }
}
