import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import { routerStatus, routerValidator, routerValidators } from "./routes";

const PORT = Number(process.env.PORT) || 3000;
const BIND = process.env.BIND || "0.0.0.0";
export const CONTRACT = process.env.CONTRACT;
export const NETWORK = process.env.NETWORK || "regtest";
export const RPC_URL = process.env.RPC_URL;

const app: Express = express();
app.use(cors());
app.use(express.json());

export enum Status {
  Pending = "pending",
  Registered = "registered",
  Unregistered = "unregistered",
  Updating = "updating",
}

app.use("/v1/status", routerStatus);
app.use("/v1/validator", routerValidator);
app.use("/v1/validators", routerValidators);

app.listen(PORT, BIND, async () => {
  console.log(`[server]: Server is running at ${BIND}:${PORT}`);
});
