import { Router, Request, Response } from "express";
import { getBalances } from "../functions";
import { CONTRACT, NETWORK } from "../functions";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const updaters = await getBalances();
  return res.send({
    updaters,
    contract: CONTRACT,
    network: NETWORK,
  });
});

export const routerStatus = router;
