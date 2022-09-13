import { Request, Response } from "express";
import Router from "express-promise-router";
import { getBalances } from "../logic";

import { CONTRACT, DI, NETWORK } from "../server";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const updaters = await getBalances();
  return res.send({
    updaters,
    contract: CONTRACT,
    network: NETWORK,
  });
});

export const StatusController = router;
