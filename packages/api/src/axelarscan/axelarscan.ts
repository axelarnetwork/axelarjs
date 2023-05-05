import ky, { Options } from "ky";

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

export type GetChainConfigsResponse = {
  evm: EVMChainConfig[];
  cosmos: CosmosChainConfig[];
};

export class AxelarscanClient {
  private client: typeof ky;

  constructor(options: Options) {
    this.client = ky.extend(options);
  }

  static init(options: Options) {
    return new AxelarscanClient(options);
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

    const { evm, cosmos, ...result } = await this.client
      .post("", { json })
      .json<GetChainConfigsResponse>();

    const isEligible = (a: EVMChainConfig | CosmosChainConfig) =>
      (!a?.is_staging || params.isStaging) &&
      !params.disabledChains?.includes(a.id);

    return {
      ...result,
      evm: evm.filter(isEligible),
      cosmos: cosmos.filter(isEligible),
    };
  }
}

export const createAxelarscanClient = AxelarscanClient.init;
