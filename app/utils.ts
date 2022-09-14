import { Network } from "firovm-sdk";

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
