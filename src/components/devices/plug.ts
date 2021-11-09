import { MqttClient } from "mqtt";
import { plugStore, options } from "kavanest-store";
import { disconnectWatchdog } from "../helpers";

export default class Plug {
  client: MqttClient;
  timer: NodeJS.Timeout;
  topic: string;
  name: string;

  data: plugData = {
    name: null,
    state: null,
    connected: null,
  };

  constructor(client: MqttClient, deviceConfig: any) {
    this.client = client;

    this.name = deviceConfig.name;
    this.topic = deviceConfig.topic;

    this.data.connected = false;
    this.timer = disconnectWatchdog(this.data, `${this.name} disconnected`, writeToMongo);
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: MQTTpalyoad = JSON.parse(rawPayload.toString());

        this.data = {
          name: this.name,
          state: payload.state,
          connected: true,
        };

        writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.name} disconnected`, writeToMongo);
      } catch (error) {
        console.log(`${this.name} disconnected`);
      }
    }
  }
}

const writeToMongo = async (data: plugData) => {
  await plugStore.findOneAndUpdate(
    { name: data.name },
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
interface plugData {
  name: string | null;
  state: boolean | null;
  connected: boolean | null;
}
