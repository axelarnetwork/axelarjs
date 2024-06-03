import { createPublicClient, http } from "viem";

import { extractReceiptInfoForNativeGasPaid } from "./getReceiptInfo";

describe("getReceiptInfo", () => {
  test.skip("should be able to extract paidFee, destChain, and logIndex", async () => {
    const rpcUrl = "https://polygon.drpc.org";
    const txHash =
      "0x93cdf6b9fb302e22161a39d05a9b8ec0d9da7f0a280fa19175289f175b97e400";
    const client = createPublicClient({
      transport: http(rpcUrl),
    });

    const srcTxReceipt = await client.getTransactionReceipt({
      hash: txHash,
    });


    const result = extractReceiptInfoForNativeGasPaid(srcTxReceipt);
    console.log(srcTxReceipt)
    console.log(result)

    expect(result).toStrictEqual({
      paidFee: 4631952231329464473n,
      destChain: "Arbitrum",
      logIndex: 388,
    });
  });
});
