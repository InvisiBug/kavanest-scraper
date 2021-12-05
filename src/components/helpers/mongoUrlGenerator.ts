require("dotenv").config();

const log: boolean = false;
const environment: string = process.env.ENVIRONMENT ?? "";

export let mongoUrl: string = "";

switch (environment) {
  case "live":
    log ? console.log("Mongo: running in live 🔥") : null;
    mongoUrl = process.env.MONGO_LIVE ?? "";
    break;

  case "test":
    log ? console.log("Mongo: running in test 🧪") : null;
    mongoUrl = process.env.MONGO_TEST ?? "";
    break;

  case "local":
    log ? console.log("Mongo: running locally on this computer💻") : null;
    mongoUrl = process.env.MONGO_LOCAL ?? "";
    console.log(mongoUrl);
    break;

  case "docker":
    log ? console.log("Mongo: running in docker 🐳") : null;
    break;
}
