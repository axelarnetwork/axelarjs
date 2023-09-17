import getDepositAddress from "./getDepositAddress";

describe("getDepositAddress", () => {
  test("get deposit address", async () => {
    const res = await getDepositAddress({
      sourceChain: "Fantom",
      destinationChain: "ethereum-2",
      asset: "uaxl",
      destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      module: "evm",
    });
    console.log({ res });
    expect(res).toBeTruthy();
  });
});
