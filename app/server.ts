import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import { routerStatus, routerValidators } from "./routes";
import { connect } from "mongoose";

const PORT = Number(process.env.PORT) || 3000;
const BIND = process.env.BIND || "0.0.0.0";
const MONGODB_URL = process.env.MONGODB_URL;

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/v1/status", routerStatus);
app.use("/v1/validators", routerValidators);

app.listen(PORT, BIND, async () => {
  await connect(MONGODB_URL!);
  console.log(`[server]: Server is running at ${BIND}:${PORT}`);
});
