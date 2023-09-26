import { partition } from "rambda";

import {
  IsomorphicHTTPClient,
  type ClientOptions,
} from "../IsomorphicHTTPClient";
import type {
  AxelarAssetPrice,
  AxelarScanAsset,
  CosmosChainConfig,
  EVMChainConfig,
  LinkEvent,
  LinkRequestRawResponse,
  LinkRequestResponse,
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

export class AxelarscanClient extends IsomorphicHTTPClient {
  static init(options: ClientOptions) {
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

  async searchTransactions(params: { size: number; type: string }) {
    const json = {
      method: "searchTransactions",
      type: params.type,
      size: params.size,
    };

    const result = await this.client
      .post("", { json })
      .json<LinkRequestRawResponse>();

    return result;
  }

  async getRecentLinkTransactions(params: {
    size: number;
  }): Promise<LinkRequestResponse[]> {
    const res = await this.searchTransactions({
      size: params.size,
      type: "LinkRequest",
    });

    return res.data
      .filter((entry) => entry.code === 0) //only want successfully broadcasted txs
      .map((entry) => {
        const logs = entry.logs[0];
        const linkEvent = logs?.events.find((event) => event.type === "link");
        const { attributes } = linkEvent as LinkEvent;
        const find = (key: string) =>
          attributes.find((attr: { key: string }) => attr.key === key)?.value;
        return {
          sourceChain: find("sourceChain"),
          destinationChain: find("destinationChain"),
          depositAddress: find("depositAddress"),
          destinationAddress: find("destinationAddress"),
          module: find("module"),
          asset: find("asset"),
          tokenAddress: find("tokenAddress"),
          txHash: entry.txhash,
          timmestamp: entry.timestamp,
        };
      });
  }
}
