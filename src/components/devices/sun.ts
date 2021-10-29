import { MqttClient } from "mqtt";
import { options } from "../database/options";
import SunStore from "../database/sun";

export default class Sun {
  client: MqttClient;

  constructor(client: MqttClient) {
    this.client = client;
  }

  async handleIncoming(topic: String, rawPayload: object) {
    if (topic === "Sun") {
      const payload = JSON.parse(rawPayload.toString());
      await SunStore.findOneAndUpdate({ id: 5 }, { state: payload.state }, options);
    }
  }
}
