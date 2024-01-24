import { AXELAR_RPC_URLS } from "@axelarjs/core";
import { TokenType } from "@axelarjs/proto/axelar/evm/v1beta1/query";

import { createAxelarQueryClient } from "../stargateClient";

describe("query client", () => {
  test("query erc20Tokens", async () => {
    const client = await createAxelarQueryClient(AXELAR_RPC_URLS.testnet);

    const erc20Tokens = await client.evm.eRC20Tokens({
      chain: "fantom",
      type: TokenType.TOKEN_TYPE_EXTERNAL,
    });

    expect(erc20Tokens?.tokens?.length).toBeGreaterThan(0);
  });
});
