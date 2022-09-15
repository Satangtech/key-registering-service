import { Router, Request, Response } from "express";
import { getValidatorProposalDetails } from "../functions";
import { Validator } from "../models";

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

export const routerValidators = router;
