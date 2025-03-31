import { type Environment } from "@axelarjs/core";

import { ClientMeta, RestService, type RestServiceOptions } from "../lib/rest-service";
import type { AxelarConfigsResponse } from "./types";

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
    return this.client
      .get(`configs/${this.env}-config-1.x.json`)
      .json<AxelarConfigsResponse>();
  }

  async getAxelarAssetConfigs() {
    return this.client.get(`/${this.env}-asset-config.json`).json();
  }

  async getAxelarChainConfigs() {
    return this.client.get(`/${this.env}-chain-config.json`).json();
  }
}
