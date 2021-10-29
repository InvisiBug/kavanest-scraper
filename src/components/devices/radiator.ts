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
      console.log("here");

      await RadiatorStore.findOneAndUpdate(
        { id: 5 },
        {
          inlet: parseFloat((JSON.parse(payload.toString()).inlet - 0.56).toFixed(2)),
          outlet: parseFloat((JSON.parse(payload.toString()).outlet - 0).toFixed(2)),
        },
        options,
      );
    }
  }
}
