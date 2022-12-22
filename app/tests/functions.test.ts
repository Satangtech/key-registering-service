import {
  banValidator,
  deleteProposal,
  getBalances,
  getHexIdAndBytesPubkey,
  getValidatorProposalDetails,
  getValidatorProposalId,
  isBanned,
  sendProposalValidator,
  unbanValidator,
} from "../functions";

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
    isBanned: jest.fn(() => Promise.resolve(true)),
  };
});

describe("Test Functions", () => {
  test("getHexIdAndBytesPubkey", () => {
    const { idHex, pubkeyBytes } = getHexIdAndBytesPubkey(
      "id1",
      "021af85de9a8417be364b6c1b5b58cad265b45a8b2767c7db02e85337d1640815e"
    );
    expect(idHex).toBe("0x696431");
    expect(Buffer.from(pubkeyBytes).toString("hex")).toBe(
      "021af85de9a8417be364b6c1b5b58cad265b45a8b2767c7db02e85337d1640815e"
    );
  });

  test("getValidatorProposalId", () => {
    const validatorProposalID = getValidatorProposalId(
      "id1",
      "021af85de9a8417be364b6c1b5b58cad265b45a8b2767c7db02e85337d1640815e"
    );
    expect(validatorProposalID).toBe(
      BigInt(
        "51579481589692591047841457232895012519469546025627130991274813009304752768272"
      )
    );
  });

  test("getBalances", async () => {
    const balances = await getBalances();
    expect(balances).toEqual([
      { address: "TEkTAdizm1nQNTWnt1RpCiahiAmgcJ7iYw", balance: "123.55" },
    ]);
  });

  test("sendProposalValidator", async () => {
    const txid = await sendProposalValidator(
      "id1",
      "021af85de9a8417be364b6c1b5b58cad265b45a8b2767c7db02e85337d1640815e"
    );
    expect(txid).toBe(
      "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
    );
  });

  test("getValidatorProposalDetails", async () => {
    const details = await getValidatorProposalDetails(
      "id1",
      "021af85de9a8417be364b6c1b5b58cad265b45a8b2767c7db02e85337d1640815e"
    );
    expect(details).toEqual({
      proposer: "0x346f0BBbc6B4FfEdf2E7F18D7bA5265748663C17",
      startTime: "1664188422",
      votingStatus: "0",
      againstVotes: "0",
      forVotes: "1",
      abstainVotes: "0",
    });
  });

  test("banValidator", async () => {
    const txid = await banValidator("id1");
    expect(txid).toBe(
      "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
    );
  });

  test("unbanValidator", async () => {
    const txid = await unbanValidator("id1");
    expect(txid).toBe(
      "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
    );
  });

  test("deleteProposal", async () => {
    const txid = await deleteProposal(
      "id1",
      "021af85de9a8417be364b6c1b5b58cad265b45a8b2767c7db02e85337d1640815e"
    );
    expect(txid).toBe(
      "d13fa5c7c608bec8f6a393876e5da8d1109f28b741207141747e1b4237e7a03d"
    );
  });

  test("isBanned", async () => {
    const banned = await isBanned("id1");
    expect(banned).toBe(true);
  });
});
