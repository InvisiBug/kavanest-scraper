import { MqttClient } from "mqtt";
import { SunStore, options } from "../database";
import { setDisconnected, disconnectWatchdog } from "../helpers";
import { sunData } from "../types";

export default class Sun {
  client: MqttClient;
  timer: NodeJS.Timeout;
  data: sunData = {
    state: null,
    connected: null,
  };

  constructor(client: MqttClient) {
    this.client = client;
    this.data.connected = false;
    this.timer = disconnectWatchdog(this.data, writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === "Sun") {
      const payload: MQTTpalyoad = JSON.parse(rawPayload.toString());

      this.data = {
        state: payload.state,
        connected: true,
      };

      writeToMongo(this.data);

      clearTimeout(this.timer);
      this.timer = disconnectWatchdog(this.data, writeToMongo);
    }
  }
}

const writeToMongo = async (data: sunData) => {
  await SunStore.findOneAndUpdate(
    { id: 5 },
    {
      state: data.state,
      connected: data.connected,
    },
    options,
  );
};

interface MQTTpalyoad {
  node: String;
  state: boolean;
}
