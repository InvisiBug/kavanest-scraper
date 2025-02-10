/*
 * WiFi Devices
 */
export { default as Radiator } from "./wifiDevices/radiator";
export { default as plug } from "./wifiDevices/plug";
export { default as valve } from "./wifiDevices/valve";
export { default as rgbLight } from "./wifiDevices/rgbLight";
export { default as computerAudio } from "./wifiDevices/computerAudio";

/*
 * Zigbee Devices
 */
export { default as zigbeeSensor } from "./zigbeeDevices/sensor";
export { default as zigbeePlug } from "./zigbeeDevices/plug";
export { default as zigbeeRGBStrip } from "./zigbeeDevices/rgbStrip";
export { default as zigbeeBulb } from "./zigbeeDevices/bulb";
export { default as zigbeeMotionSensor } from "./zigbeeDevices/motion";

export interface DeviceConfig {
  topic: string;
  name: string;
  sort?: number;
  room?: string;
}
