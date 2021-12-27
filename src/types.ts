import { Radiator } from "./components/devices";

export type allowedDevices = Radiator;

export interface sunData {
  state: Boolean | null;
  connected: Boolean | null;
}

export interface floodlightData {
  state: Boolean | null;
  connected: Boolean | null;
}

export interface sensorData {
  room: string | null;
  temperature: number | null;
  humidity: number | null;
  connected: Boolean | null;
}
