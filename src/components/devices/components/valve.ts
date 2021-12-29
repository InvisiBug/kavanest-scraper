import { MqttClient } from "mqtt";
import { valveStore, options } from "../../database";
import { disconnectWatchdog } from "../../utils";

export default class Valve {
  client: MqttClient;
  timer: NodeJS.Timeout;
  topic: string;
  name: string;

  data: valveData = {
    room: null,
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
          room: this.name,
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

const writeToMongo = async (data: valveData) => {
  await valveStore.findOneAndUpdate(
    { room: data.room },
    {
      $set: {
        state: data.state,
        connected: data.connected,
      },
    },
    options,
  );
};

interface MQTTpalyoad {
  node: String;
  state: boolean;
}

interface valveData {
  room: string | null;
  state: boolean | null;
  connected: boolean | null;
}
