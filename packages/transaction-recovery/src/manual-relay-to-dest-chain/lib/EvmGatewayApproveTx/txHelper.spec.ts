import { hashMessage } from "viem";

import * as TxHelper from "./txHelper";

describe("TxHelper", () => {
  const rpcUrl =
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  test("should be able to create the approve transaction correctly", async () => {
    const gatewayAddress = "0x4F4495243837681061C4743b74B3eEdf548D56A5";
    const serializedTx = await TxHelper.createApproveTx(
      rpcUrl,
      hashMessage("hello"),
      gatewayAddress
    );

    expect(serializedTx).toBeDefined();
  });

  test("should be able to get chain id and max priority fee per gas from given rpcUrl correctly", async () => {
    const { chainId, maxPriorityFeePerGas } =
      await TxHelper.getChainIdandMaxPriorityFeePerGas(rpcUrl);

    expect(chainId).toBe(1);
    expect(maxPriorityFeePerGas).toBeDefined();
  });

});
