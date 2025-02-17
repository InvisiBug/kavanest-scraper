import { MqttClient } from "mqtt";
import { disconnectWatchdog, camelRoomName } from "../../helpers";
import { sensorStore, options, motionStore } from "../../database";
import { Socket } from "socket.io";
import { DeviceConfig } from "..";

export default class ZigbeeMotion {
  timer: NodeJS.Timeout;
  client: MqttClient;
  socket: Socket;
  topic: string;
  data: Data;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;
    this.topic = deviceConfig.topic;

    this.data = {
      name: deviceConfig.name,
      room: deviceConfig.room,
      battery: null,
      battery_low: null,
      linkquality: null,
      occupancy: null,
      voltage: null,
      connected: false,
    };

    this.timer = disconnectWatchdog(this.data, "sensor disconnect", this.writeToMongo, 60 /* second timeout */);
  }

  async handleIncoming(topic: string, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const { battery, battery_low, linkquality, occupancy, voltage }: PayloadData = JSON.parse(rawPayload.toString());

        this.data = {
          ...this.data,
          name: this.data.name,
          linkquality,
          battery,
          voltage,
          battery_low,
          occupancy,
          connected: true,
        };

        this.writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.name} sensor disconnected`, this.writeToMongo, 60 /* second timeout */);
      } catch (error) {
        console.log(`${this.data.name} sensor disconnected`);
      }
    }
  }

  writeToMongo = async (data: Data) => {
    try {
      await motionStore.findOneAndUpdate({ room: data.name }, { $set: data }, options).then(async (mongoDoc) => {
        if (mongoDoc.value) {
          if (Object(mongoDoc).constructor !== Promise) {
            const id = mongoDoc.value._id.toString() as string;

            this.socket.emit(id, {
              ...data,
              _id: id,
            });
          }
        }
      });
    } catch (error) {
      console.log("Mongo Connection Dropped, Restarting ...");
      console.log(error);
      process.exit();
    }
  };
}

interface Data {
  name: string | undefined;
  room: string | undefined;
  battery: number | null;
  battery_low: boolean | null;
  linkquality: number | null;
  occupancy: boolean | null;
  voltage: number | null;
  connected: boolean;
}

interface PayloadData {
  battery: number;
  battery_low: boolean;
  linkquality: number;
  occupancy: boolean;
  voltage: number;
}
