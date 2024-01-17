import { createAxelarConfigClient } from "@axelarjs/api";
import { ENVIRONMENTS } from "@axelarjs/core";

import { getActiveChains, unwrappable } from "./depositService";

describe("depositService - helper", () => {
  describe("unwrappable", () => {
    test("should return true if destination chain is EVM and asset is wrapped native gas token", async () => {
      const env = ENVIRONMENTS.testnet;
      const configClients = createAxelarConfigClient(env);
      const chainConfigs = await configClients.getChainConfigs(env);

      Object.entries(chainConfigs.chains).forEach(([chainId, chainConfig]) => {
        const { assets } = chainConfig;
        assets.map((asset) => {
          if (asset.module === "evm" && asset.isERC20WrappedNativeGasToken) {
            expect(unwrappable(chainId, asset.id, chainConfigs)).toBeTruthy();
          } else {
            expect(unwrappable(chainId, asset.id, chainConfigs)).toBeFalsy();
          }
        });
      });
    });
  });

  describe("getActiveChains", () => {
    test.only("should return a list of active chains", async () => {
      const env = ENVIRONMENTS.testnet;
      const activeChains = await getActiveChains(env);
      expect(activeChains.length).toBeGreaterThan(0);
    });
  });
});
