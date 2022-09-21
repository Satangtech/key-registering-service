import { Router, Request, Response } from "express";
import {
  getValidatorProposalDetails,
  sendProposalValidator,
  sendVote,
} from "../functions";
import { ProposalStatus, Status, Validator } from "../models";
import { getVote } from "../utils";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const validators = await Validator.find()
      .sort({ _id: -1 })
      .select({ _id: 0, __v: 0 });
    return res.json(validators);
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validator = await Validator.findOne({ id }).select({
      _id: 0,
      __v: 0,
    });
    if (!validator) {
      return res.status(404).json({ error: "Validator not found" });
    }
    const details = await getValidatorProposalDetails(
      validator.id,
      validator.publickey
    );
    return res.json({ ...validator, details });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, publickey } = req.body;
    const validator = new Validator({ id, publickey });
    const txid = await sendProposalValidator(id, publickey);
    await validator.save();

    return res.json({
      id: validator.id,
      publickey: validator.publickey,
      status: Status.Pending,
      txid,
    });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { publickey, status } = req.body;
    const vote = getVote(status);
    const txid = await sendVote(id, publickey, vote);
    const details = await getValidatorProposalDetails(id, publickey);

    if (details.votingStatus === ProposalStatus["3"]) {
      await Validator.updateOne(
        { id },
        { publickey, status: Status.Registered }
      );
    } else if (details.votingStatus === ProposalStatus["4"]) {
      await Validator.updateOne(
        { id },
        { publickey, status: Status.Unregistered }
      );
    }

    return res.json({
      publickey,
      status: Status.Updating,
      txid,
    });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

export const routerValidators = router;
