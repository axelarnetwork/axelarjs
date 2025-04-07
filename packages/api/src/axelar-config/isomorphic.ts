import { type Environment } from "@axelarjs/core";

import {
  ClientMeta,
  RestService,
  type RestServiceOptions,
} from "../lib/rest-service";
import type { AxelarConfigsResponse, ChainConfig } from "./types";

export class AxelarConfigClient extends RestService {
  env: Environment;

  constructor(
    env: Environment,
    options: RestServiceOptions,
    meta?: ClientMeta
  ) {
    super(options, meta);
    this.env = env;
  }

  static init(options: RestServiceOptions, env: Environment) {
    return new AxelarConfigClient(env, options, {
      name: "AxelarConfigClient",
      version: "0.0.1",
    });
  }

  async getAxelarConfigs() {
    const response = await this.client
      .get(`configs/${this.env}-config-1.x.json`)
      .json<AxelarConfigsResponse>();

    const keys = Object.keys(response.chains);

    const chains = {} as Record<string, ChainConfig>;

    for (const key of keys) {
      const originalChain = response.chains[key] as ChainConfig;
      const originalIconUrl = originalChain.iconUrl;

      const fullIconUrl = `${response.resources.staticAssetHost}/${originalIconUrl}`;

      chains[key] = {
        ...originalChain,
        iconUrl: fullIconUrl,
      };
    }

    return {
      ...response,
      chains,
    };
  }

  async getAxelarAssetConfigs() {
    return this.client.get(`/${this.env}-asset-config.json`).json();
  }

  async getAxelarChainConfigs() {
    return this.client.get(`/${this.env}-chain-config.json`).json();
  }
}
