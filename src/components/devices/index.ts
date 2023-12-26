export { default as heatingSensor } from "./components/wifiDevices/heatingSensor";
export { default as Radiator } from "./components/wifiDevices/radiator";
export { default as plug } from "./components/wifiDevices/plug";
export { default as valve } from "./components/wifiDevices/valve";
export { default as offset } from "./components/wifiDevices/offsets";
export { default as rgbLight } from "./components/wifiDevices/rgbLight";
export { default as computerAudio } from "./components/wifiDevices/computerAudio";
export { default as zigbeeSensor } from "./components/zigbeeDevices/sensor";

export interface DeviceConfig {
  topic: string;
  name: string;
  sort?: number;
}
