import { createAxelarConfigClient } from "@axelarjs/api";
import { ENVIRONMENTS } from "@axelarjs/core";

import { getActiveChains, unwrappable } from "./depositService";

describe("depositService - helper", () => {
  describe("unwrappable", () => {
    test("should return true if destination chain is EVM and asset is wrapped native gas token", async () => {
      const env = ENVIRONMENTS.testnet;
      const configClients = createAxelarConfigClient(env);
      const chainConfigs = await configClients.getAxelarConfigs(env);

      Object.entries(chainConfigs.assets).forEach(([assetId, assetConfig]) => {
        Object.entries(assetConfig.chains).forEach(
          ([chainId, assetChainConfig]) => {
            if (assetChainConfig.isERC20WrappedNativeGasToken) {
              expect(unwrappable(chainId, assetId, chainConfigs)).toBeTruthy();
            } else {
              expect(unwrappable(chainId, assetId, chainConfigs)).toBeFalsy();
            }
          },
        );
      });
    });
  });

  describe("getActiveChains", () => {
    test("should return a list of active chains", async () => {
      const env = ENVIRONMENTS.testnet;
      const activeChains = await getActiveChains(env);
      expect(activeChains.length).toBeGreaterThan(0);
    });
  });
});
