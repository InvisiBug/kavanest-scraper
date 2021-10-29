import { MqttClient } from "mqtt";
import { FloodlightStore, options } from "../database/";

export default class Floodlight {
  client: MqttClient;

  constructor(client: MqttClient) {
    this.client = client;
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === "Plug") {
      const payload = JSON.parse(rawPayload.toString());
      await FloodlightStore.findOneAndUpdate({ id: "ourRoom" }, { state: payload.state }, options);
    }
  }
}
