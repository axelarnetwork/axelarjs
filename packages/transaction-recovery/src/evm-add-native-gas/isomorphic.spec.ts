import { evmAddNativeGas } from "./client";

describe("EVM - addNativeGas - (isomorphic)", () => {
  it("should add native gas to a transaction", async () => {
    const tx = await evmAddNativeGas({
      chain: "arbitrum",
      estimatedGasUsed: 100000,
      txHash: "0x1234567890",
      evmSendOptions: {
        environment: "mainnet",
      },
    });
  });
});
