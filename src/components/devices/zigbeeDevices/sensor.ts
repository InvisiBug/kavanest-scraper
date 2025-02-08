import { MqttClient } from "mqtt";
import { disconnectWatchdog, camelRoomName } from "../../helpers";
import { sensorStore, options } from "../../database";
import { Socket } from "socket.io";
import { DeviceConfig } from "..";

export default class ZigbeeSensor {
  timer: NodeJS.Timeout;
  client: MqttClient;
  socket: Socket;
  topic: string;
  data: Data;

  offset: number = 0;

  constructor(client: MqttClient, deviceConfig: DeviceConfig, socket: Socket) {
    this.client = client;
    this.socket = socket;
    this.topic = deviceConfig.topic;

    this.data = {
      room: deviceConfig.room,
      temperature: null,
      battery: null,
      linkquality: null,
      humidity: null,
      connected: false,
      voltage: null,
    };

    this.timer = disconnectWatchdog(this.data, "sensor disconnect", this.writeToMongo, 60 /* second timeout */);
  }

  async handleIncoming(topic: string, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const { temperature, humidity, battery, linkquality, voltage }: PayloadData = JSON.parse(rawPayload.toString());
        // console.log(topic, temperature, humidity, battery, linkquality);

        this.data = {
          ...this.data,

          temperature: Number(temperature.toFixed(1)),
          humidity,
          linkquality,
          battery,
          voltage,
          connected: true,
        };

        this.writeToMongo(this.data);

        clearTimeout(this.timer);
        this.timer = disconnectWatchdog(this.data, `${this.data.room} sensor disconnected`, this.writeToMongo, 60 /* second timeout */);
      } catch (error) {
        console.log(`${this.data.room} sensor disconnected`);
      }
    }
  }

  writeToMongo = async (data: Data) => {
    try {
      await sensorStore.findOneAndUpdate({ room: data.room }, { $set: data }, options).then(async (mongoDoc) => {
        if (mongoDoc.value) {
          if (Object(mongoDoc).constructor !== Promise) {
            const id: string = mongoDoc.value._id.toString();
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

const getOffsets = async (room: string) => {
  try {
    const sensorData: any = await sensorStore.findOne({ room });
    if (sensorData.offset) {
      return sensorData.offset;
    } else {
      return 0;
    }
  } catch (error) {
    // console.log("Sensor object doesnt exist");
    return 0;
  }
};

interface Data {
  room: string | undefined;
  temperature: number | null;
  humidity: number | null;
  connected: Boolean | null;
  linkquality: number | null;
  voltage: number | null;
  battery: number | null;
}

interface PayloadData {
  battery: number;
  humidity: number;
  linkquality: number;
  temperature: number;
  voltage: number;
}
