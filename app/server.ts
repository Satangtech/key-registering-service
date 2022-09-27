import cors from "cors";
import "dotenv/config";
import express, { Express } from "express";
import { connect } from "mongoose";
import { routerStatus, routerValidators } from "./routes";

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
