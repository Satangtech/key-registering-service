import "dotenv/config";
import express, { Express } from "express";
import { connect, connection, disconnect } from "mongoose";
import request from "supertest";
import { Status } from "../models";
import { routerStatus, routerValidators } from "../routes";

const MONGODB_URL_TEST = process.env.MONGODB_URL_TEST;
if (!MONGODB_URL_TEST) throw new Error("MONGODB_URL_TEST is not defined");

const app: Express = express();
app.use(express.json());
app.use("/v1/status", routerStatus);
app.use("/v1/validators", routerValidators);

jest.mock("../functions", () => {
  const originalModule = jest.requireActual("../functions");
  return {
    ...originalModule,
    getBalances: jest.fn(() =>
      Promise.resolve([
        { address: "TEkTAdizm1nQNTWnt1RpCiahiAmgcJ7iYw", balance: "123.55" },
      ])
    ),
    sendProposalValidator: jest.fn(() =>
      Promise.resolve(
        "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
      )
    ),
    getValidatorProposalDetails: jest.fn(() => {
      return {
        proposer: "0x346f0BBbc6B4FfEdf2E7F18D7bA5265748663C17",
        startTime: "1664188422",
        votingStatus: "0",
        againstVotes: "0",
        forVotes: "1",
        abstainVotes: "0",
      };
    }),
    banValidator: jest.fn(() =>
      Promise.resolve(
        "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
      )
    ),
    unbanValidator: jest.fn(() =>
      Promise.resolve(
        "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
      )
    ),
    deleteProposal: jest.fn(() =>
      Promise.resolve(
        "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
      )
    ),
    isBanned: jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false),
  };
});

beforeAll(async () => {
  await connect(MONGODB_URL_TEST!);
  console.log(`Our Current Database Name : ${connection.db.databaseName}`);
});

afterAll(async () => {
  await connection.db.dropDatabase();
  console.log(`${connection.db.databaseName} database dropped.`);
  await disconnect();
});

describe("Test API", () => {
  test("GET /v1/status", async () => {
    const response = await request(app).get("/v1/status");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      updaters: [
        {
          address: "TEkTAdizm1nQNTWnt1RpCiahiAmgcJ7iYw",
          balance: "123.55",
        },
      ],
      contract: "83C5Fee9A0E4108D7e3b9EdC15368ed0D46319d3",
      network: "regtest",
    });
  });

  test("POST /v1/validators", async () => {
    const response = await request(app).post("/v1/validators").send({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      txid: "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d",
      status: Status.Pending,
    });
  });

  test("GET /v1/validators", async () => {
    const response = await request(app).get("/v1/validators");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: "id1",
        status: "registered",
        publickey:
          "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      },
    ]);
  });

  test("GET /v1/validators/:id", async () => {
    const id = "id1";
    const response = await request(app).get(`/v1/validators/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      status: "registered",
      details: {
        proposer: "0x346f0BBbc6B4FfEdf2E7F18D7bA5265748663C17",
        startTime: "1664188422",
        votingStatus: "0",
        againstVotes: "0",
        forVotes: "1",
        abstainVotes: "0",
      },
    });
  });

  test("PUT Baned /v1/validators/:id", async () => {
    const id = "id1";
    let response = await request(app).put(`/v1/validators/${id}`).send({
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      banned: true,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      status: "banned",
      txid: "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d",
    });

    response = await request(app).get(`/v1/validators/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      status: "banned",
      details: {
        proposer: "0x346f0BBbc6B4FfEdf2E7F18D7bA5265748663C17",
        startTime: "1664188422",
        votingStatus: "0",
        againstVotes: "0",
        forVotes: "1",
        abstainVotes: "0",
      },
    });
  });

  test("PUT Unbanned /v1/validators/:id", async () => {
    const id = "id1";
    let response = await request(app).put(`/v1/validators/${id}`).send({
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      banned: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      status: "registered",
      txid: "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d",
    });

    response = await request(app).get(`/v1/validators/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      status: "registered",
      details: {
        proposer: "0x346f0BBbc6B4FfEdf2E7F18D7bA5265748663C17",
        startTime: "1664188422",
        votingStatus: "0",
        againstVotes: "0",
        forVotes: "1",
        abstainVotes: "0",
      },
    });
  });

  test("Deleted /v1/validators/:id", async () => {
    const id = "id1";
    const response = await request(app).delete(`/v1/validators/${id}`);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "id1",
      publickey:
        "0267d932bb682d97a0ffcd7205bd5c7d0edcc2733b29f6747fd5a0f06e5b1ddbac",
      status: "deleted",
      msg: "API for deleting validator is not implemented yet",
    });
  });
});
