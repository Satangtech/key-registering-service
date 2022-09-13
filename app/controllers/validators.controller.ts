import { Request, Response } from "express";
import Router from "express-promise-router";
import { DI } from "../server";
import { QueryOrder } from "@mikro-orm/core";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const validators = await DI.validatorRepository.findAll({
    orderBy: { updatedAt: QueryOrder.DESC },
    fields: ["validatorId", "publickey", "status"],
  });
  return res.json(
    validators.map(({ validatorId, publickey, status }) => ({
      id: validatorId,
      publickey,
      status,
    }))
  );
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id: validatorId } = req.params;
  try {
    const validator = await DI.validatorRepository.findOneOrFail({
      validatorId,
    });
    return res.json({
      id: validator.validatorId,
      publickey: validator.publickey,
      status: validator.status,
    });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

export const ValidatorsController = router;
