import type { Environment } from "@axelarjs/core";

import {
  IsomorphicHTTPClient,
  type ClientOptions,
} from "../IsomorphicHTTPClient";
import type { ChainConfigsResponse } from "./types";

export class AxelarConfigClient extends IsomorphicHTTPClient {
  static init(options: ClientOptions) {
    return new AxelarConfigClient(options, {
      name: "AxelarConfigClient",
      version: "0.0.1",
    });
  }

  async getChainConfigs(env: Environment) {
    return this.client
      .get(`configs/${env}-chain-config-latest.json`)
      .json<ChainConfigsResponse>();
  }
}
