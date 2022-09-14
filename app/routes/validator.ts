import { Router, Request, Response } from "express";
import { Status } from "../models/validator";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { id, publickey } = req.body;
  return res.send({
    id,
    publickey,
    status: Status.Pending,
  });
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { publickey, status } = req.body;
  return res.send({
    publickey,
    status: "updating",
  });
});

export const routerValidator = router;
