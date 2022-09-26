import {
  getBalances,
  getHexIdAndBytesPubkey,
  getValidatorProposalId,
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
});
