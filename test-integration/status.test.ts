import {
  Client,
  Context,
  Network,
  PrivkeyAccount,
  RPCClient,
} from "firovm-sdk";
import fetch from "node-fetch";
import { mobileValidatorAddress, testAddresses, testPrivkeys } from "./data";

describe("Status API", () => {
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

  beforeAll(async () => {
    await loadWallet();
  });

  test("GET /v1/status", async () => {
    const res = await fetch(`${url}/v1/status`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.updaters.length).toBeGreaterThan(0);
    expect(data.updaters[0].address).toBe(address.testAddress1);
    expect(data.updaters[0].balance).toBeGreaterThan(0);
    expect(data.contract).toBe(mobileValidatorAddress);
    expect(data.network).toBe("testnet");
  });
});
