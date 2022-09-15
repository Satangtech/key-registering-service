import { Router, Request, Response } from "express";
import { sendProposalValidator } from "../functions";
import { Status, Validator } from "../models/validator";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, publickey } = req.body;
    const validator = new Validator({ id, publickey });
    await sendProposalValidator(id, publickey);
    await validator.save();

    return res.json({
      id: validator.id,
      publickey: validator.publickey,
      status: validator.status,
    });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { publickey, status } = req.body;
    await Validator.updateOne({ id }, { publickey, status: Status.Updating });
    return res.json({
      publickey,
      status: Status.Updating,
    });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

export const routerValidator = router;
