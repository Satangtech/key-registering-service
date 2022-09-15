import { Router, Request, Response } from "express";
import {
  getValidatorProposalDetails,
  sendProposalValidator,
  sendVote,
} from "../functions";
import { ProposalStatus, Status, Validator } from "../models/validator";
import { getVote } from "../utils";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, publickey } = req.body;
    const validator = new Validator({ id, publickey });
    const txid = await sendProposalValidator(id, publickey);
    await validator.save();

    return res.json({
      id: validator.id,
      publickey: validator.publickey,
      status: validator.status,
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

export const routerValidator = router;
