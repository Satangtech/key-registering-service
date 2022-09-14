import { Router, Request, Response } from "express";
import { Status } from "../server";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  return res.send([
    {
      id: "validator1",
      publickey: "publickey1",
      status: `${Status.Pending}|${Status.Registered}|${Status.Unregistered}|${Status.Updating}`,
    },
  ]);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  return res.send({
    id,
    publickey: "publickey1",
    status: `${Status.Pending}|${Status.Registered}|${Status.Unregistered}|${Status.Updating}`,
  });
});

export const routerValidators = router;
