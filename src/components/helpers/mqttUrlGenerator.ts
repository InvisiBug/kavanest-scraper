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
    log ? console.log("Running locally on this computer💻") : null;
    mqttUrl = process.env.MQTT_LOCAL ?? ""; // Development
    break;

  case "docker":
    log ? console.log("Running in docker 🐳") : null;
    break;
}
