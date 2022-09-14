import express, { Express, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { getBalances } from "./logic";

const PORT = Number(process.env.PORT) || 3000;
const BIND = process.env.BIND || "0.0.0.0";
export const CONTRACT = process.env.CONTRACT;
export const NETWORK = process.env.NETWORK || "regtest";
export const RPC_URL = process.env.RPC_URL;

const app: Express = express();
app.use(cors());
app.use(express.json());

enum Status {
  Pending = "pending",
  Registered = "registered",
  Unregistered = "unregistered",
  Updating = "updating",
}

app.get("/v1/status", async (req: Request, res: Response) => {
  const updaters = await getBalances();
  return res.send({
    updaters,
    contract: CONTRACT,
    network: NETWORK,
  });
});

app.get("/v1/validators", async (req: Request, res: Response) => {
  return res.send([
    {
      id: "validator1",
      publickey: "publickey1",
      status: `${Status.Pending}|${Status.Registered}|${Status.Unregistered}|${Status.Updating}`,
    },
  ]);
});

app.get("/v1/validators/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  return res.send({
    id,
    publickey: "publickey1",
    status: `${Status.Pending}|${Status.Registered}|${Status.Unregistered}|${Status.Updating}`,
  });
});

app.post("/v1/validator", async (req: Request, res: Response) => {
  const { id, publickey } = req.body;
  return res.send({
    id,
    publickey,
    status: Status.Pending,
  });
});

app.put("/v1/validator/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { publickey, status } = req.body;
  return res.send({
    publickey,
    status: "updating",
  });
});

app.listen(PORT, BIND, async () => {
  console.log(`[server]: Server is running at ${BIND}:${PORT}`);
});
