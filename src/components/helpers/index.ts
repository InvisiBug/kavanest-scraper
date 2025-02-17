export const disconnectWatchdog = (data: any, msg: string, writeToMongo: any, time: number = 10) => {
  return setTimeout(() => {
    // console.log("Disconnect watchdog fired by", data.room);
    data = setDisconnected(data, msg);
    try {
      writeToMongo(data);
    } catch (error) {
      console.log("Disconnected");
      console.log(error);
    }
  }, time * 1000);
};

// Sets the disconnected state of a device to false
export const setDisconnected = (data: any, msg: string): any => {
  // console.log("🚀 ~ setDisconnected ~ data:", data)

  // console.log(msg); // TODO remove this, will need to alter all calls
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

export { mqttUrl, mongoUrl } from "./urlGenerators";
