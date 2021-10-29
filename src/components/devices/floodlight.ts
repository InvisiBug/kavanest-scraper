import { MqttClient } from "mqtt";
import { options } from "../database/options";
import Plug from "../database/plug";

export default class Floodlight {
  client: MqttClient;

  constructor(client: MqttClient) {
    this.client = client;
  }

  async handleIncoming(topic: String, rawPayload: object) {
    if (topic === "Plug") {
      const payload = JSON.parse(rawPayload.toString());
      await Plug.findOneAndUpdate({ id: 5 }, { state: payload.state }, options);
    }
  }
}
