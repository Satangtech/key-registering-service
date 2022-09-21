import { Request, Response, Router } from "express";
import {
  banValidator,
  deleteProposal,
  getValidatorProposalDetails,
  isBanned,
  sendProposalValidator,
  unbanValidator,
} from "../functions";
import { Status, updateValidatorStatus, Validator } from "../models";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const validators = await Validator.find()
      .sort({ _id: -1 })
      .select({ _id: 0, __v: 0 });
    validators.map(async ({ id, status, publickey }) => {
      const baned = await isBanned(id);
      const newStatus = updateValidatorStatus(id, status, baned);
      return {
        id,
        status: newStatus,
        publickey,
      };
    });
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
    const baned = await isBanned(id);
    const newStatus = updateValidatorStatus(id, validator.status, baned);
    return res.json({ ...validator, status: newStatus, details });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, publickey } = req.body;
    const txid = await sendProposalValidator(id, publickey);
    const validator = new Validator({
      id,
      publickey,
      status: Status.Registered,
    });
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
    let result;

    if (status === "ban") {
      const txid = await banValidator(id);
      await Validator.updateOne({ id }, { publickey, status: Status.Baned });
      result = {
        id,
        publickey,
        status: Status.Baned,
        txid,
      };
    } else if (status === "unban") {
      const txid = await unbanValidator(id);
      await Validator.updateOne(
        { id },
        { publickey, status: Status.Registered }
      );
      result = {
        id,
        publickey,
        status: Status.Registered,
        txid,
      };
    } else {
      return res.status(400).json({ error: "Invalid status" });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validator = await Validator.findOne({ id });
    if (!validator) {
      return res.status(404).json({ error: "Validator not found" });
    }
    const txid = await deleteProposal(validator.id, validator.publickey);
    await Validator.deleteOne({ id });

    return res.json({
      id,
      publickey: validator.publickey,
      status: "deleted",
      txid,
    });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

export const routerValidators = router;
