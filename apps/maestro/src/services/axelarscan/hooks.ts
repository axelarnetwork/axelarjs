import { useQuery } from "wagmi";

import { DISABLED_CHAINS } from "~/config/chains";

import { getAssetPrices, getAssets, getChainConfigs } from ".";

export function useChainConfigsQuery() {
  return useQuery(["axelarscan-chain-configs"], getChainConfigs, {
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}

export function useEVMChainConfigsQuery() {
  const { data, ...query } = useChainConfigsQuery();

  return {
    data: data?.evm?.filter(
      (chain) => !(DISABLED_CHAINS.has(chain?.chain_id) || chain?.deprecated)
    ),
    ...query,
  };
}

export function useCosmosChainConfigsQuery() {
  const { data, ...query } = useChainConfigsQuery();

  return {
    data: data?.cosmos,
    ...query,
  };
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
