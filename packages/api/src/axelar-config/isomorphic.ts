import { type Environment } from "@axelarjs/core";

import { RestService, type RestServiceOptions } from "../lib/rest-service";
import type { AxelarConfigsResponse } from "./types";

export class AxelarConfigClient extends RestService {
  static init(options: RestServiceOptions) {
    return new AxelarConfigClient(options, {
      name: "AxelarConfigClient",
      version: "0.0.1",
    });
  }

  async getAxelarConfigs(env: Environment) {
    // TODO: use 1.x for all envs once ayush fixes the config
    const fileName =
      env === "devnet-amplifier"
        ? `configs/${env}-config-1.0.x.json`
        : `configs/${env}-config-1.x.json`;

    return this.client
      .get(fileName)
      .json<AxelarConfigsResponse>();
  }

  async getAxelarAssetConfigs(env: Environment) {
    return this.client.get(`/${env}-asset-config.json`).json();
  }

  async getAxelarChainConfigs(env: Environment) {
    return this.client.get(`/${env}-chain-config.json`).json();
  }
}
