import { MqttClient } from "mqtt";
import { SunStore, options } from "../database";

export default class Sun {
  client: MqttClient;

  constructor(client: MqttClient) {
    this.client = client;
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === "Sun") {
      const payload = JSON.parse(rawPayload.toString());
      await SunStore.findOneAndUpdate({ id: 5 }, { state: payload.state }, options);
    }
  }
}
