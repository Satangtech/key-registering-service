import { model, Schema } from "mongoose";

export enum Status {
  Pending = "pending",
  Registered = "registered",
  Unregistered = "unregistered",
  Updating = "updating",
  Baned = "baned",
}

export enum ProposalStatus {
  OnGoing,
  Cancelled,
  VerdictPending,
  ProposalSucceeded,
  ProposalVotedOut,
}

interface IValidator {
  id: string;
  publickey: string;
  status: Status;
}

const validatorSchema = new Schema<IValidator>({
  id: { type: String, required: true, unique: true },
  publickey: { type: String, required: true, unique: true },
  status: {
    type: String,
    default: Status.Pending,
    enum: Object.values(Status),
  },
});

export const Validator = model<IValidator>("Validator", validatorSchema);
