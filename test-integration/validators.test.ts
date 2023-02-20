import {
  Client,
  Context,
  Network,
  PrivkeyAccount,
  RPCClient,
} from "firovm-sdk";
import fetch from "node-fetch";
import { abiMobileValidator } from "../abi/mobileValidator";
import { abiPOAGovernance } from "../abi/poaGovernance";
import { abiQtumGov } from "../abi/qtumGov";
import { getValidatorProposalId } from "../functions";
import { ProposalStatus } from "../models";
import {
  mobileValidatorAddress,
  poaGovernanceAddress,
  qtumGovAddress,
  testAddresses,
  testPrivkeys,
} from "./data";

describe("Validator API", () => {
  jest.setTimeout(60 * 1000);
  const url = "http://key-regis:3000";
  const urlFirovm = new URL("http://test:test@firovm:1234");
  const rpcClient = new RPCClient(urlFirovm.href);
  const client = new Client(urlFirovm.href);
  const address = testAddresses;
  const privkey = testPrivkeys;
  const context = new Context().withNetwork(Network.Testnet);
  const account = {
    acc1: new PrivkeyAccount(context, privkey.testPrivkey1),
    acc2: new PrivkeyAccount(context, privkey.testPrivkey2),
    acc3: new PrivkeyAccount(context, privkey.testPrivkey3),
    acc4: new PrivkeyAccount(context, privkey.testPrivkey4),
    acc5: new PrivkeyAccount(context, privkey.testPrivkey5),
  };
  const qtumGovContract = new client.Contract(abiQtumGov, qtumGovAddress);
  const poaGovContract = new client.Contract(
    abiPOAGovernance,
    poaGovernanceAddress
  );
  const mobileValidatorContract = new client.Contract(
    abiMobileValidator,
    mobileValidatorAddress
  );
  const mobileStatus = {
    Enabled: "0",
    Prepared: "1",
    Disabled: "2",
  };
  const mobileProposalStatus = {
    OnGoing: "0",
    Cancelled: "1",
    VerdictPending: "2",
    ProposalSucceeded: "3",
    ProposalVotedOut: "4",
  };

  const loadWallet = async () => {
    await rpcClient.rpc("loadwallet", ["testwallet"]);
  };

  const generateToAddress = async () => {
    const { result } = await rpcClient.rpc("generatetoaddress", [
      1,
      address.testAddress1,
    ]);
    expect(result.length).toBeGreaterThan(0);
  };

  const initQtumGov = async () => {
    let txid = await qtumGovContract.methods.setInitialAdmin().send({
      from: account.acc1,
    });
    expect(typeof txid).toBe("string");
    await generateToAddress();

    const { result, error } = await rpcClient.getTransactionReceipt(txid);
    expect(error).toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].excepted).toBe("None");

    txid = await qtumGovContract.methods
      .setContracts(mobileValidatorAddress, poaGovernanceAddress)
      .send({
        from: account.acc1,
      });
    expect(typeof txid).toBe("string");
    await generateToAddress();

    const { result: result2, error: error2 } =
      await rpcClient.getTransactionReceipt(txid);
    expect(error2).toBeNull();
    expect(result2.length).toBeGreaterThan(0);
    expect(result2[0].excepted).toBe("None");
  };

  const initPoaGov = async () => {
    const txid = await poaGovContract.methods
      .setDGPContract(qtumGovAddress)
      .send({
        from: account.acc1,
      });
    expect(typeof txid).toBe("string");
    await generateToAddress();
    const { result, error } = await rpcClient.getTransactionReceipt(txid);
    expect(error).toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].excepted).toBe("None");
  };

  const initMobileValidator = async () => {
    let txid = await mobileValidatorContract.methods
      .setDGPContract(qtumGovAddress)
      .send({
        from: account.acc1,
      });
    expect(typeof txid).toBe("string");
    await generateToAddress();
    const { result, error } = await rpcClient.getTransactionReceipt(txid);
    expect(error).toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].excepted).toBe("None");

    txid = await mobileValidatorContract.methods.changeToPrepared().send({
      from: account.acc1,
    });
    expect(typeof txid).toBe("string");
    await generateToAddress();
    const { result: result2, error: error2 } =
      await rpcClient.getTransactionReceipt(txid);
    expect(error2).toBeNull();
    expect(result2.length).toBeGreaterThan(0);
    expect(result2[0].excepted).toBe("None");

    txid = await mobileValidatorContract.methods.changeToEnabled().send({
      from: account.acc1,
    });
    expect(typeof txid).toBe("string");
    await generateToAddress();
    const { result: result3, error: error3 } =
      await rpcClient.getTransactionReceipt(txid);
    expect(error3).toBeNull();
    expect(result3.length).toBeGreaterThan(0);
    expect(result3[0].excepted).toBe("None");

    const res = await mobileValidatorContract.methods.status().call();
    expect(res["0"]).toBe(mobileStatus.Enabled);
  };

  const executeVote = async (id: string, publickey: string) => {
    const validatorProposalID = getValidatorProposalId(id, publickey);
    const txid = await mobileValidatorContract.methods
      .endVotingPeriod(validatorProposalID)
      .send({
        from: account.acc1,
      });
    expect(typeof txid).toBe("string");
    await generateToAddress();
    const { result, error } = await rpcClient.getTransactionReceipt(txid);
    expect(error).toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].excepted).toBe("None");
    expect(
      (
        await mobileValidatorContract.methods
          .getValidatorProposalDetails(validatorProposalID)
          .call()
      )["2"]
    ).toBe(mobileProposalStatus.VerdictPending);

    const txid2 = await mobileValidatorContract.methods
      .executeVote(validatorProposalID)
      .send({
        from: account.acc1,
      });
    expect(typeof txid2).toBe("string");
    await generateToAddress();
    const { result: result2, error: error2 } =
      await rpcClient.getTransactionReceipt(txid2);
    expect(error2).toBeNull();
    expect(result2.length).toBeGreaterThan(0);
    expect(result2[0].excepted).toBe("None");
    expect(
      (
        await mobileValidatorContract.methods
          .getValidatorProposalDetails(validatorProposalID)
          .call()
      )["2"]
    ).toBe(mobileProposalStatus.ProposalSucceeded);
  };

  beforeAll(async () => {
    await loadWallet();
    await initQtumGov();
    await initPoaGov();
    await initMobileValidator();
  });

  beforeEach(async () => {
    await generateToAddress();
  });

  test("POST /v1/validators", async () => {
    const res = await fetch(`${url}/v1/validators`, {
      method: "POST",
      body: JSON.stringify({
        id: "test1",
        publickey: `0x${account.acc1.get_pubkey().toString()}`,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.id).toBe("test1");
    expect(data.publickey).toBe(account.acc1.get_pubkey().toString());
    expect(data.status).toBe("pending");
    expect(typeof data.txid).toBe("string");
  });

  test("GET /v1/validators", async () => {
    const res = await fetch(`${url}/v1/validators`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.length).toBeGreaterThan(0);
  });

  test("GET /v1/validators/:id", async () => {
    await executeVote("test1", account.acc1.get_pubkey().toString());

    const res = await fetch(`${url}/v1/validators/test1`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.id).toBe("test1");
    expect(data.publickey).toBe(`${account.acc1.get_pubkey().toString()}`);
    expect(data.status).toBe("registered");
    expect(data.details.votingStatus).toBe(ProposalStatus["3"]);
    expect(data.details.forVotes).toBe("1");
  });

  test("POST Duplicate id /v1/validators/", async () => {
    const res = await fetch(`${url}/v1/validators`, {
      method: "POST",
      body: JSON.stringify({
        id: "test1",
        publickey: `${account.acc2.get_pubkey().toString()}`,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Duplicate id test1");
  });

  test("POST Duplicate publickey /v1/validators/", async () => {
    const res = await fetch(`${url}/v1/validators`, {
      method: "POST",
      body: JSON.stringify({
        id: "test2",
        publickey: `${account.acc1.get_pubkey().toString()}`,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe(
      `Duplicate publickey ${account.acc1.get_pubkey().toString()}`
    );
  });

  test("PUT err required /v1/validators/:id", async () => {
    const res = await fetch(`${url}/v1/validators/test1`, {
      method: "PUT",
      body: JSON.stringify({
        publickey: `${account.acc1.get_pubkey().toString()}`,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Id and banned is required!");
  });

  test("PUT ban /v1/validators/:id", async () => {
    const res = await fetch(`${url}/v1/validators/test1`, {
      method: "PUT",
      body: JSON.stringify({
        publickey: `${account.acc1.get_pubkey().toString()}`,
        banned: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.id).toBe("test1");
    expect(data.publickey).toBe(`${account.acc1.get_pubkey().toString()}`);
    expect(data.status).toBe("banned");
    expect(typeof data.txid).toBe("string");
  });

  test("PUT unbanned /v1/validators/:id", async () => {
    const res = await fetch(`${url}/v1/validators/test1`, {
      method: "PUT",
      body: JSON.stringify({
        publickey: `${account.acc1.get_pubkey().toString()}`,
        banned: false,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.id).toBe("test1");
    expect(data.publickey).toBe(`${account.acc1.get_pubkey().toString()}`);
    expect(data.status).toBe("registered");
    expect(typeof data.txid).toBe("string");
  });

  test("PUT err id not found /v1/validators/:id", async () => {
    const res = await fetch(`${url}/v1/validators/test2`, {
      method: "PUT",
      body: JSON.stringify({
        publickey: `${account.acc1.get_pubkey().toString()}`,
        banned: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe("Validator not found");
  });

  test("DELETE err id not found /v1/validators/:id", async () => {
    const res = await fetch(`${url}/v1/validators/test2`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe("Validator not found");
  });

  test("DELETE /v1/validators/:id", async () => {
    const res = await fetch(`${url}/v1/validators/test1`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(204);
  });
});
