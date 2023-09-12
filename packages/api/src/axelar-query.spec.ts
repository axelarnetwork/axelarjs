import { createAxelarQueryNodeClient } from "./axelar-query/node";

describe("axelar-query", () => {
  test("do stuff", async () => {
    const api = createAxelarQueryNodeClient({});
    const fees = await api.estimateGasFee({
      sourceChain: "ethereum-2",
      destinationChain: "avalanche",
    });
    console.log({ fees });
  });
});
