import { Request, Response, Router } from "express";
import {
  banValidator,
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
    const result = await Promise.all(
      validators.map(async ({ id, status, publickey }) => {
        const baned = await isBanned(id);
        const newStatus = await updateValidatorStatus(id, status, baned);
        return {
          id,
          status: newStatus,
          publickey,
        };
      })
    );
    return res.json(result);
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
    const { publickey, status } = validator;
    const details = await getValidatorProposalDetails(id, publickey);
    const baned = await isBanned(id);
    const newStatus = await updateValidatorStatus(id, status, baned);
    return res.json({ id, publickey, status: newStatus, details });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, publickey } = req.body;
    const checkId = await Validator.findOne({ id }).select({
      _id: 0,
      __v: 0,
    });
    if (checkId) {
      return res.status(400).json({ error: `Duplicate id ${id}` });
    }
    const checkPubkey = await Validator.findOne({ publickey }).select({
      _id: 0,
      __v: 0,
    });
    if (checkPubkey) {
      return res
        .status(400)
        .json({ error: `Duplicate publickey ${publickey}` });
    }

    const txid = await sendProposalValidator(id, publickey);
    const validator = new Validator({
      id,
      publickey,
      status: Status.Registered,
    });
    await validator.save();

    return res.status(201).json({
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
    const { publickey, banned } = req.body;
    let status, txid;
    if (id === undefined || banned === undefined) {
      return res.status(400).json({ error: "Id and banned is required!" });
    }

    if (banned) {
      txid = await banValidator(id);
      status = Status.Banned;
    } else {
      txid = await unbanValidator(id);
      status = Status.Registered;
    }

    await Validator.findOneAndUpdate({ id }, { publickey, status });
    return res.json({
      id,
      publickey,
      status,
      txid,
    });
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

    return res.json({
      id,
      publickey: validator.publickey,
      status: "deleted",
      msg: "API for deleting validator is not implemented yet",
    });
  } catch (error) {
    return res.status(500).json({ error: (<any>error).message });
  }
});

export const routerValidators = router;
