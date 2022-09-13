import { Entity, Property, Unique, Index } from "@mikro-orm/core";

import { BaseEntity } from "./BaseEntity";

export enum Status {
  Pending = "pending",
  Registered = "registered",
  Unregistered = "unregistered",
  Updating = "updating",
}

@Entity()
@Index({ properties: ["validatorId"] })
export class Validator extends BaseEntity {
  @Property()
  @Unique()
  validatorId: string;

  @Property()
  publickey: string;

  @Property()
  status: Status = Status.Pending;

  constructor(validatorId: string, publickey: string) {
    super();
    this.validatorId = validatorId;
    this.publickey = publickey;
  }
}
