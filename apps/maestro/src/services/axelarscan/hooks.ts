import { indexBy, prop } from "rambda";
import { useQuery } from "wagmi";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { trpc } from "~/lib/trpc";

import { getAssetPrices, getAssets, getChainConfigs } from ".";

const EVM_CHAIN_CONFIGS_BY_ID = indexBy(prop("id"), EVM_CHAIN_CONFIGS);

export function useChainConfigsQuery() {
  return useQuery(["axelarscan-chain-configs"], getChainConfigs, {
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}

export function useEVMChainConfigsQuery() {
  const { data, ...queryResult } = trpc.axelarscan.getEVMChainConfigs.useQuery(
    undefined,
    {
      staleTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...queryResult,
    data,
    computed: {
      indexedByChainId: indexBy(prop("chain_id"), data ?? []),
      wagmiChains: (data ?? []).map(
        (x) => EVM_CHAIN_CONFIGS_BY_ID[String(x.chain_id)]
      ),
    },
  };
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
