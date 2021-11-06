import { floodlightData, sunData } from "../types";

export const setDisconnected = (data: floodlightData | sunData): floodlightData | sunData => {
  console.log("Disconnected");
  data = {
    ...data,
    connected: false,
  };
  return data;
};

export const disconnectWatchdog = (data: floodlightData | sunData, writeToMongo: any) => {
  return setTimeout(() => {
    data = setDisconnected(data);
    writeToMongo(data);
  }, 10 * 1000);
};
