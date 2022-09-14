import { RPCClient, Context, PrivkeyAccount, Client } from "firovm-sdk";
import { privkeys } from "./privkey";
import { getNetwork } from "./utils";
import "dotenv/config";

import abiMobileValidator from "./abi/mobileValidator.json";

const RPC_URL = process.env.RPC_URL;
export const NETWORK = process.env.NETWORK || "regtest";
export const CONTRACT = process.env.CONTRACT;
export const context = new Context().withNetwork(getNetwork(NETWORK));
export const client = new Client(RPC_URL!);

export const getBalances = async () => {
  const rpc = new RPCClient(RPC_URL!);
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

export const getHexIdAndBytesPubkey = (id: string, publickey: string) => {
  const idHex = client.web3.utils.asciiToHex(id);
  const pubkeyBytes = Uint8Array.from(Buffer.from(`0x${publickey}`, "hex"));
  return { idHex, pubkeyBytes };
};

export const getValidatorProposalId = (
  id: string,
  publickey: string
): BigInt => {
  const { idHex, pubkeyBytes } = getHexIdAndBytesPubkey(id, publickey);
  const paramEncode = client.web3.eth.abi.encodeParameters(
    ["bytes32", "bytes"],
    [idHex, pubkeyBytes]
  );
  return BigInt(client.web3.utils.keccak256(paramEncode));
};

export const getContractMobileValidator = () => {
  return new client.Contract(abiMobileValidator, CONTRACT!);
};

export const sendProposalValidator = async (
  id: string,
  publickey: string
): Promise<string> => {
  const account = new PrivkeyAccount(context, privkeys[0]);
  const { idHex, pubkeyBytes } = getHexIdAndBytesPubkey(id, publickey);
  const contractMobileValidator = getContractMobileValidator();
  const txid = await contractMobileValidator.methods
    .proposeValidator(idHex, pubkeyBytes, true)
    .send({ from: account });
  return txid;
};

export const getValidatorProposalDetails = async (
  id: string,
  publickey: string
) => {
  const validatorProposalID = getValidatorProposalId(id, publickey);
  const contractMobileValidator = getContractMobileValidator();
  const details = await contractMobileValidator.methods
    .getValidatorProposalDetails(validatorProposalID)
    .call();
  return {
    proposer: details["0"],
    startTime: details["1"],
    votingStatus: details["2"],
    againstVotes: details["3"],
    forVotes: details["4"],
    abstainVotes: details["5"],
  };
};
