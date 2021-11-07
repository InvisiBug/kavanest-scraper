import { floodlightData, sunData, sensorData } from "../types";

export const disconnectWatchdog = (data: floodlightData | sunData | sensorData, msg: string, writeToMongo: any) => {
  return setTimeout(() => {
    data = setDisconnected(data, msg);
    writeToMongo(data);
  }, 10 * 1000);
};

export const setDisconnected = (data: floodlightData | sunData | sensorData, msg: string): floodlightData | sunData | sensorData => {
  console.log(msg);
  data = {
    ...data,
    connected: false,
  };
  return data;
};

export const camelRoomName = (text: string) => {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return text.substr(0, 1).toLowerCase() + text.substr(1);
};
