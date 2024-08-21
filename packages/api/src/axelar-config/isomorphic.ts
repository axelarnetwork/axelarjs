import type { Environment } from "@axelarjs/core";

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
    return this.client
      .get(`configs/${env}-config-1.x.json`)
      .json<AxelarConfigsResponse>();
  }

  async getAxelarAssetConfigs(env: Environment) {
    return this.client.get(`/${env}-asset-config.json`).json();
  }

  async getAxelarChainConfigs(env: Environment) {
    return this.client.get(`/${env}-chain-config.json`).json();
  }
}
