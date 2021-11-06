import { Floodlight, Sun, Radiator } from "./devices";

export type allowedDevices = Floodlight | Sun | Radiator;

export interface sunData {
  state: Boolean | null;
  connected: Boolean | null;
}

export interface floodlightData {
  state: Boolean | null;
  connected: Boolean | null;
}
