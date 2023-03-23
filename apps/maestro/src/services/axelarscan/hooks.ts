import { useQuery } from "wagmi";

import { trpc } from "~/lib/trpc";

import { getAssetPrices, getAssets, getChainConfigs } from ".";

export function useChainConfigsQuery() {
  return useQuery(["axelarscan-chain-configs"], getChainConfigs, {
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}

export function useEVMChainConfigsQuery() {
  return trpc.axelarscan.getEVMChainConfigs.useQuery();
}

export function useCosmosChainConfigsQuery() {
  return trpc.axelarscan.getCosmosChainConfigs.useQuery();
}

export function useAssetsQuery(denoms: string[] = []) {
  return useQuery(
    ["axelarscan-assets", denoms],
    getAssets.bind(null, denoms?.length ? { denoms } : undefined)
  );
}

export function useAssetPricesQuery(denoms: string[] = []) {
  return useQuery(
    ["axelarscan-asset-prices", denoms],
    getAssetPrices.bind(null, { denoms })
  );
}

export function useAssetQuery(denom: string) {
  return useAssetsQuery([denom]);
}

export function useAssetPriceQuery(denom: string) {
  return useAssetPricesQuery([denom]);
}
