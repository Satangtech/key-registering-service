import { Network } from "firovm-sdk";

export const getVote = (status: string) => {
  // 0 => Abstain
  // 1 => Vote for
  // 2 => Vote against
  switch (status) {
    case "registered":
      return 1;
    case "unregistered":
      return 2;
    default:
      return 0;
  }
};

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
