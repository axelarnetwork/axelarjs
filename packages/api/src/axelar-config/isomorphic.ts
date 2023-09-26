import type { Environment } from "@axelarjs/core";

import {
  IsomorphicHTTPClient,
  type IsomorphicClientOptions,
} from "../isomorphic-http-client";
import type { Asset, ChainConfig, ChainConfigsResponse } from "./types";

export class AxelarConfigClient extends IsomorphicHTTPClient {
  static init(options: IsomorphicClientOptions) {
    return new AxelarConfigClient(options, {
      name: "AxelarConfigClient",
      version: "0.0.1",
    });
  }

  async getChainConfigs(env: Environment) {
    const response = await this.client
      .get(`configs/${env}-chain-config-latest.json`)
      .json<ChainConfigsResponse>();

    const chainEntries = Object.entries(response.chains);

    const tagChainAsset = ([chainId, chainConfig]: [string, ChainConfig]) =>
      [
        chainId,
        {
          ...chainConfig,
          assets: chainConfig.assets.map(
            (asset) =>
              ({
                ...asset,
                module: chainConfig.module === "evm" ? "evm" : "cosmos",
              } as Asset)
          ),
        } as ChainConfig,
      ] as const;

    return {
      ...response,
      chains: Object.fromEntries(chainEntries.map(tagChainAsset)),
    };
  }
}
