import { RestService, type RestServiceOptions } from "../lib/rest-service";
import type {
  AxelarAssetPrice,
  AxelarScanAsset,
  CosmosChainConfig,
  EVMChainConfig,
  LinkEvent,
  LinkRequestRawResponse,
  LinkRequestResponse,
  SearchBatchesResponse,
  VMChainConfig,
} from "./types";

export type AxelarApiParams<T extends Record<string, unknown>> = T & {
  module: string;
  path: string | null;
};

export type GetAssetsResponse = AxelarScanAsset[];

export type GetAssetsPriceResponse = AxelarAssetPrice[];

export type GetChainConfigsResponse = (
  | EVMChainConfig
  | CosmosChainConfig
  | VMChainConfig
)[];

export class AxelarscanClient extends RestService {
  static init(options: RestServiceOptions) {
    return new AxelarscanClient(options, {
      name: "AxelarscanClient",
      version: "0.0.1",
    });
  }

  async getAssets() {
    return await this.client.get("/api/getAssets").json<GetAssetsResponse>();
  }

  async getAssetPrices() {
    return await this.client
      .get("/api/getTokensPrice")
      .json<GetAssetsPriceResponse>();
  }

  async getChainConfigs(
    params: {
      isStaging?: boolean;
      disabledChains?: string[];
    } = {}
  ) {
    const chains = await this.client
      .get("/api/getChains")
      .json<GetChainConfigsResponse>();

    const isEligible = (
      a: EVMChainConfig | CosmosChainConfig | VMChainConfig
    ) =>
      (!a?.deprecated || params.isStaging) &&
      !params.disabledChains?.includes(a.id);

    return {
      evm: chains.filter(
        (c) => c.chain_type === "evm" && isEligible(c)
      ) as EVMChainConfig[],
      cosmos: chains.filter(
        (c) => c.chain_type === "cosmos" && isEligible(c)
      ) as CosmosChainConfig[],
      vm: chains.filter(
        (c) => c.chain_type === "vm" && isEligible(c)
      ) as VMChainConfig[],
    };
  }

  async searchTransactions(params: { size: number; type: string }) {
    const path = `/validator/searchTransactions?size=${params.size}&type=${params.type}`;
    return await this.client.get(path).json<LinkRequestRawResponse>();
  }

  async searchBatchedCommands(params: {
    commandId?: string | undefined;
    sourceTransactionHash?: string | undefined;
  }) {
    const json = {
      commandId: params.commandId,
      sourceTransactionHash: params.sourceTransactionHash,
    };

    const result = await this.client
      .post("token/searchBatches", { json })
      .json<SearchBatchesResponse>();

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
