import { QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

import { getConfigs, type EnvironmentConfigs } from "../constants";
import type { AxelarQueryClientConfig } from "../types";
import { setupQueryExtension, type AxelarQueryService } from "./types";

export * from "../types";

export type AxelarQueryClientType = QueryClient & AxelarQueryService;

let instance: AxelarQueryClientType;

export class AxelarQueryClient extends QueryClient {
  static async init(config: AxelarQueryClientConfig) {
    if (!instance) {
      const { axelarRpcUrl, environment } = config;
      const links: EnvironmentConfigs = getConfigs(environment);
      const rpc: string = axelarRpcUrl || links.axelarRpcUrl;
      instance = QueryClient.withExtensions(
        await Tendermint34Client.connect(rpc),
        setupQueryExtension
      );
    }
    return instance;
  }
}

export const createAxelarQueryClient = AxelarQueryClient.init;
