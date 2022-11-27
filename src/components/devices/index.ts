export { default as heatingSensor } from "./components/heatingSensor";
export { default as Radiator } from "./components/radiator";
export { default as plug } from "./components/plug";
export { default as valve } from "./components/valve";
export { default as offset } from "./components/offsets";
export { default as rgbLight } from "./components/rgbLight";
export { default as computerAudio } from "./components/computerAudio";
export { default as radiatorV2 } from "./components/radiatorV2";

export interface DeviceConfig {
  topic: string;
  name: string;
}
