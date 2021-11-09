import { MqttClient } from "mqtt";
import { offsetStore, options } from "kavanest-store";

export default class Offsets {
  client: MqttClient;
  topic: String;

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Room Offsets";
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === "roomOffsets") {
      const payload = JSON.parse(rawPayload.toString());
      console.log(payload);

      await offsetStore.findOneAndUpdate(
        { name: "roomOffsets" },
        {
          name: "roomOffsets",
          livingRoom: payload.livingRoom,
          kitchen: payload.kitchen,
          liamsRoom: payload.liamsRoom,
          study: payload.study,
          ourRoom: payload.ourRoom,
        },
        options,
      );
    }
  }
}
