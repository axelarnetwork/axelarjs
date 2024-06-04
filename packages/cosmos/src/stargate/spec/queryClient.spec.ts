import { AXELAR_RPC_URLS } from "@axelarjs/core";
import { TokenType } from "@axelarjs/proto/axelar/evm/v1beta1/query";

import { createAxelarQueryClientWithFallback } from "../stargateClient";

describe("query client", () => {
  const fallbackRpcUrls = [
    AXELAR_RPC_URLS.testnet,
    "https://tm.axelar-testnet.lava.build:443",
    "https://axelartest-rpc.quickapi.com:443",
    "https://axelar-rpc-1.staketab.org:443",
  ];

  test("query erc20Tokens", async () => {
    const client = await createAxelarQueryClientWithFallback(fallbackRpcUrls);

    const erc20Tokens = await client.evm.eRC20Tokens({
      chain: "fantom",
      type: TokenType.TOKEN_TYPE_EXTERNAL,
    });

    expect(erc20Tokens?.tokens?.length).toBeGreaterThan(0);
  });
});
