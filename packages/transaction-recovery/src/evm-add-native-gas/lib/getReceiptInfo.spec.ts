import { createPublicClient, http } from "viem";

import { extractReceiptInfoForNativeGasPaid } from "./getReceiptInfo";

describe("getReceiptInfo", () => {
  test("should be able to extract paidFee, destChain, and logIndex", async () => {
    const rpcUrl = "https://polygon.drpc.org";
    const txHash =
      "0x5d954ef42f5fd589718907b8c2399d113845f56d747c3397356adc2a896cb48d";
    const client = createPublicClient({
      transport: http(rpcUrl),
    });

    const srcTxReceipt = await client.getTransactionReceipt({
      hash: txHash,
    });

    const result = extractReceiptInfoForNativeGasPaid(srcTxReceipt);

    expect(result).toStrictEqual({
      paidFee: 4631952231329464473n,
      destChain: "Arbitrum",
      logIndex: 388,
    });
  });
});
