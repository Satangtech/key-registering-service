import { Validator } from "./entities/Validator";

export default {
  entities: [Validator],
  dbName: "validator",
  type: "mongo",
  clientUrl: "mongodb://mongo:27017",
};
