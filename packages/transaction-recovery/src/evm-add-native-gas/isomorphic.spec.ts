import { evmAddNativeGas } from "./client";

describe("EVM - addNativeGas - (isomorphic)", () => {
  it("should add native gas to a transaction", async () => {
    await evmAddNativeGas({
      chain: "linea",
      estimatedGasUsed: 100000,
      txHash:
        "0x37183ac1c2b0910276f2e3b3ecb14f11f0196dd0068edf4783254a8ccee11996",
      evmSendOptions: {
        environment: "mainnet",
      },
    });
  });
});
