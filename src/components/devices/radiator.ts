import { MqttClient } from "mqtt";
import { RadiatorStore, options } from "../database";

export default class RadiatorMonitor {
  client: MqttClient;
  topic: String;
  inlet: number = 0;
  outlet: number = 0;

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Radiator";
  }

  async handleIncoming(topic: String, payload: Object) {
    if (topic === "Radiator Monitor") {
      const inlet = parseFloat((JSON.parse(payload.toString()).inlet - 0.56).toFixed(2));
      const outlet = parseFloat((JSON.parse(payload.toString()).outlet - 0).toFixed(2));

      await RadiatorStore.findOneAndUpdate({ room: "ourRoom" }, { inlet, outlet }, options);
    }
  }
}
