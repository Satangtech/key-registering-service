import { RPCClient, Context, Network, PrivkeyAccount } from "firovm-sdk";
import { privkeys } from "./privkey";
import { NETWORK, RPC_URL } from "./server";

export const getNetwork = (network: string): Network => {
  switch (network) {
    case "regtest":
      return Network.Regtest;
    case "testnet":
      return Network.Testnet;
    case "mainnet":
      return Network.Mainnet;
    default:
      throw new Error("Invalid network");
  }
};

export const getBalances = async () => {
  const rpc = new RPCClient(RPC_URL!);
  const context = new Context().withNetwork(getNetwork(NETWORK));
  const balances = await Promise.all(
    privkeys.map(async (privkey) => {
      const account = new PrivkeyAccount(context, privkey);
      const address = account.address().toString();
      const { result } = await rpc.getAddressBalance(address);
      return { address, balance: result.balance };
    })
  );
  return balances;
};
