require("dotenv").config();

const log: boolean = false;
const environment: string = process.env.ENVIRONMENT ?? "";

export let mqttUrl: string = "";

switch (environment) {
  case "live":
    log ? console.log("MQTT: running in live 🔥") : null;
    mqttUrl = process.env.MQTT_LIVE ?? "";
    break;

  case "test":
    log ? console.log("MQTT: running in test 🧪") : null;
    mqttUrl = process.env.MQTT_TEST ?? "";
    break;

  case "local":
    log ? console.log("MQTT: Running locally on this computer💻") : null;
    mqttUrl = process.env.MQTT_LOCAL ?? "";
    break;

  case "docker":
    log ? console.log("MQTT: Running in docker 🐳") : null;
    mqttUrl = process.env.MQTT_DOCKER ?? "";
    console.log(mqttUrl);
    break;
}
