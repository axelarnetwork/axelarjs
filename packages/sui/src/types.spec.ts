import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { test } from "vitest";

import Contracts from "./";

describe("types", () => {
  const testnetContracts = Contracts["testnet"];
  const { InterchainTokenService } = testnetContracts;

  test("should be able to fetch basic info in a contract", async () => {
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const result =
      await InterchainTokenService.interchain_token_service.view.channelAddress(
        client,
        ["0x55fcd94e5293ff04c512a23c835d79b75e52611f66496e2d02cca439b84fa73c"]
      );

    expect(result.results_decoded?.[0]).toBeDefined();
  });
});
