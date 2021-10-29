import { MqttClient } from "mqtt";
import { PlugStore, options } from "../database/";

export default class Floodlight {
  client: MqttClient;

  constructor(client: MqttClient) {
    this.client = client;
  }

  async handleIncoming(topic: String, rawPayload: Object) {
    if (topic === "Plug") {
      const payload = JSON.parse(rawPayload.toString());
      console.log(await PlugStore.findOneAndUpdate({ id: 5 }, { state: payload.state }, options));
    }
  }
}
