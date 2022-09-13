import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Validator } from "./entities/Validator";
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import {
  StatusController,
  ValidatorController,
  ValidatorsController,
} from "./controllers";

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;
const BIND = process.env.BIND || "0.0.0.0";
export const CONTRACT = process.env.CONTRACT;
export const NETWORK = process.env.NETWORK || "regtest";
export const RPC_URL = process.env.RPC_URL;

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  validatorRepository: EntityRepository<Validator>;
};

export const init = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.validatorRepository = DI.orm.em.getRepository(Validator);
  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  app.use("/v1/status", StatusController);
  app.use("/v1/validator", ValidatorController);
  app.use("/v1/validators", ValidatorsController);
  app.use((req, res) => res.status(404).json({ message: "No route found" }));

  DI.server = app.listen(PORT, BIND, () => {
    console.log(`[server]: Server is running at ${BIND}:${PORT}`);
  });
})();
