import ky from "ky";

import {
  AxelarAssetPrice,
  AxelarScanAsset,
  CosmosChainConfig,
  EVMChainConfig,
} from "./types";

export const MODULES = {
  assets: "assets",
  data: "data",
};

export const COLLECTIONS = {
  assets: "assets",
  chains: "chains",
};

const BASE_URL = String(process.env.NEXT_PUBLIC_EXPLORER_API_URL);

const client = ky.extend({
  prefixUrl: BASE_URL,
});

export type AxelarApiParams<T extends Record<string, unknown>> = T & {
  module: string;
  path: string | null;
};

export type GetAssetsResponse = AxelarScanAsset[];

export const getAssets = async (params: { denoms: string[] }) => {
  const json = { module: MODULES.data, path: null, ...params };

  const result = await client.post("", { json }).json<GetAssetsResponse>();

  return result;
};

export type GetAssetsPriceResponse = AxelarAssetPrice[];

export const getAssetPrices = async (params: { denoms: string[] }) => {
  const json = {
    module: MODULES.assets,
    path: null,
    ...params,
  };

  const result = await client.post("", { json }).json<GetAssetsPriceResponse>();

  return result;
};

export type GetChainConfigsResponse = {
  evm: EVMChainConfig[];
  cosmos: CosmosChainConfig[];
};

export const getChainConfigs = async () => {
  const isStaging = process.env.NEXT_PUBLIC_SITE_URL?.includes("staging");

  const json = {
    module: MODULES.data,
    collection: COLLECTIONS.chains,
    path: null,
  };

  const { evm, cosmos, ...result } = await client
    .post("", { json })
    .json<GetChainConfigsResponse>();

  const disabledChains = process.env.NEXT_PUBLIC_DISABLED_CHAINS;

  return {
    ...result,
    evm: evm.filter(
      (a) => (!a?.is_staging || isStaging) && !disabledChains?.includes(a.id)
    ),
    cosmos: cosmos.filter(
      (a) => (!a?.is_staging || isStaging) && !disabledChains?.includes(a.id)
    ),
  };
};
