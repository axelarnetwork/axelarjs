import { createAxelarQueryNodeClient } from "./axelar-query/node";

describe("axelar-query", () => {
  test("do stuff", async () => {
    const api = createAxelarQueryNodeClient({});
    const fees = await api.estimateGasFee({
      sourceChain: "ethereum-2",
      destinationChain: "avalanche",
      gasLimit: 100_000n,
      gasMultiplier: 1.1,
      sourceContractAddress: "0x",
      destinationContractAddress: "0x",
      transferAmount: 1000,
      transferAmountInUnits: "1000",
    });
    console.log({ fees });
  });
});
