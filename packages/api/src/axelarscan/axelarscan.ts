import { partition } from "rambda";

import { HTTPClient, Options } from "../HTTPClient";
import {
  AxelarAssetPrice,
  AxelarScanAsset,
  CosmosChainConfig,
  EVMChainConfig,
} from "./types";

export const MODULES = {
  assets: "assets",
  data: "data",
} as const;

export const COLLECTIONS = {
  assets: "assets",
  chains: "chains",
} as const;

export type AxelarApiParams<T extends Record<string, unknown>> = T & {
  module: string;
  path: string | null;
};

export type GetAssetsResponse = AxelarScanAsset[];

export type GetAssetsPriceResponse = AxelarAssetPrice[];

export type GetChainConfigsResponse = (EVMChainConfig | CosmosChainConfig)[];

export class AxelarscanClient extends HTTPClient {
  static init(options: Options) {
    return new AxelarscanClient(options, {
      name: "AxelarscanClient",
      version: "0.0.1",
    });
  }

  async getAssets(params?: { denoms: string[] }) {
    const json = {
      module: MODULES.data,
      path: null,
      ...params,
    };

    const result = await this.client
      .post("", { json })
      .json<GetAssetsResponse>();

    return result;
  }

  async getAssetPrices(params: { denoms: string[] }) {
    const json = {
      module: MODULES.assets,
      path: null,
      ...params,
    };

    const result = await this.client
      .post("", { json })
      .json<GetAssetsPriceResponse>();

    return result;
  }

  async getChainConfigs(
    params: {
      isStaging?: boolean;
      disabledChains?: string[];
    } = {}
  ) {
    const json = {
      module: MODULES.data,
      collection: COLLECTIONS.chains,
      path: null,
    };

    const [evm, cosmos] = partition(
      (c) => c.chain_type === "evm",
      await this.client.post("", { json }).json<GetChainConfigsResponse>()
    );

    const isEligible = (a: EVMChainConfig | CosmosChainConfig) =>
      (!a?.deprecated || params.isStaging) &&
      !params.disabledChains?.includes(a.id);

    return {
      evm: evm.filter(isEligible) as EVMChainConfig[],
      cosmos: cosmos.filter(isEligible) as CosmosChainConfig[],
    };
  }
}

export const createAxelarscanClient = AxelarscanClient.init;
