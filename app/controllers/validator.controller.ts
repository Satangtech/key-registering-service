import { wrap } from "@mikro-orm/core";
import { Request, Response } from "express";
import Router from "express-promise-router";
import { Status } from "../entities/Validator";
import { DI } from "../server";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  if (!req.body.id || !req.body.publickey) {
    res.status(400);
    return res.json({ message: "One of `id, publickey` is missing" });
  }
  try {
    req.body.validatorId = req.body.id;
    delete req.body.id;
    let validator = await DI.validatorRepository.findOne({
      validatorId: req.body.validatorId,
    });
    if (validator) {
      return res.status(400).json({ message: "Validator already exists" });
    }

    validator = DI.validatorRepository.create(req.body);
    await DI.validatorRepository.persist(validator).flush();

    return res.json({
      id: validator.validatorId,
      publickey: validator.publickey,
      status: validator.status,
    });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id: validatorId } = req.params;
  const { publickey, status } = req.body;
  const validator = await DI.validatorRepository.findOneOrFail({ validatorId });
  wrap(validator).assign({ status: Status.Updating });
  await DI.validatorRepository.flush();

  return res.json({
    id: validator.validatorId,
    publickey: validator.publickey,
    status: validator.status,
  });
});

export const ValidatorController = router;
