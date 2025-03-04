import type { EVMChainConfig, VMChainConfig } from "@axelarjs/api";
import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { indexBy, partition, prop } from "rambda";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { WAGMI_CHAIN_CONFIGS } from "~/config/wagmi";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import axelarscanClient from ".";

const EVM_CHAIN_CONFIGS_BY_ID = indexBy(prop("id"), WAGMI_CHAIN_CONFIGS);
const VM_CHAIN_CONFIGS_BY_ID = indexBy(prop("id"), WAGMI_CHAIN_CONFIGS);

export function useAllChainConfigsQuery() {
  const {
    computed: evmComputed,
    data: evmChains,
    ...evmChainsQuery
  } = useEVMChainConfigsQuery();
  const {
    computed: vmComputed,
    data: vmChains,
    ...vmChainsQuery
  } = useVMChainConfigsQuery();
  const combinedComputed = useMemo(
    () => ({
      indexedById: {
        ...vmComputed.indexedById,
        ...evmComputed.indexedById,
      },
      indexedByChainId: {
        ...vmComputed.indexedByChainId,
        ...evmComputed.indexedByChainId,
      },
      wagmiChains: [...vmComputed.wagmiChains, ...evmComputed.wagmiChains],
    }),
    [evmComputed, vmComputed]
  );

  const allChains = useMemo(() => {
    // Create a lookup map using chain_id as the key
    const chainMap = new Map();

    // Process EVM chains first
    evmChains?.forEach((chain) => {
      chainMap.set(chain.chain_id, {
        ...chain,
        displayName: chain.name, // Store original name
      });
    });

    // Process VM chains, only add if not already present or if it's a special case
    vmChains?.forEach((chain) => {
      const existingChain = chainMap.get(chain.chain_id);
      if (!existingChain) {
        chainMap.set(chain.chain_id, {
          ...chain,
          displayName: `${chain.name}`, // Add VM suffix to differentiate
        });
      }
    });

    return Array.from(chainMap.values());
  }, [evmChains, vmChains]);

  return {
    combinedComputed,
    allChains,
    isLoading: evmChainsQuery.isLoading || vmChainsQuery.isLoading,
    isError: evmChainsQuery.isError || vmChainsQuery.isError,
    error: evmChainsQuery.error || vmChainsQuery.error,
    isFetching: evmChainsQuery.isFetching || vmChainsQuery.isFetching,
    isSuccess: evmChainsQuery.isSuccess || vmChainsQuery.isSuccess,
  };
}

export function useEVMChainConfigsQuery() {
  const { data, ...queryResult } = trpc.axelarscan.getEVMChainConfigs.useQuery<
    EVMChainConfig[]
  >(undefined, {
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  // Filter out chains that are not configured in the app
  const [configured, unconfigured] = useMemo(
    () => partition((x) => x.chain_id in EVM_CHAIN_CONFIGS_BY_ID, data ?? []),
    [data]
  );

  if (NEXT_PUBLIC_NETWORK_ENV !== "mainnet" && unconfigured?.length) {
    logger.once.info(
      // with emojis
      `excluded ${unconfigured?.length} chain configs:\n${unconfigured
        ?.map((x) =>
          JSON.stringify(
            {
              chain_id: x.chain_id,
              name: x.name,
            },
            null,
            2
          )
        )
        .join("\n")}`
    );
  }

  const wagmiChains = configured.map(
    (x) => EVM_CHAIN_CONFIGS_BY_ID[x.chain_id]
  );

  return {
    ...queryResult,
    data: configured,
    computed: {
      indexedByChainId: indexBy(prop("chain_id"), configured),
      indexedById: indexBy(prop("id"), configured),
      wagmiChains,
    },
  };
}

export function useVMChainConfigsQuery() {
  const { data, ...queryResult } = trpc.axelarscan.getVMChainConfigs.useQuery<
    VMChainConfig[]
  >(undefined, {
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  // Filter out chains that are not configured in the app
  const [configured, unconfigured] = useMemo(
    () => partition((x) => x.chain_id in VM_CHAIN_CONFIGS_BY_ID, data ?? []),
    [data]
  );

  if (NEXT_PUBLIC_NETWORK_ENV !== "mainnet" && unconfigured?.length) {
    logger.once.info(
      `excluded ${unconfigured?.length} VM chain configs:\n${unconfigured
        ?.map((x) =>
          JSON.stringify(
            {
              chain_id: x.chain_id,
              name: x.name,
            },
            null,
            2
          )
        )
        .join("\n")}`
    );
  }

  const wagmiChains = configured.map((x) => VM_CHAIN_CONFIGS_BY_ID[x.chain_id]);

  return {
    ...queryResult,
    data: configured,
    computed: {
      indexedByChainId: indexBy(prop("chain_id"), configured),
      indexedById: indexBy(prop("id"), configured),
      wagmiChains,
    },
  };
}

export function useCosmosChainConfigsQuery() {
  return trpc.axelarscan.getCosmosChainConfigs.useQuery();
}

export function useAssetsQuery(denoms: string[] = []) {
  return useQuery({
    queryKey: ["axelarscan-assets", denoms],
    queryFn: axelarscanClient.getAssets.bind(
      denoms?.length ? { denoms } : undefined
    ),
  });
}

export function useAssetPricesQuery(denoms: string[] = []) {
  return useQuery({
    queryKey: ["axelarscan-asset-prices", denoms],
    queryFn: axelarscanClient.getAssetPrices.bind({ denoms }),
  });
}

export function useAssetQuery(denom: string) {
  return useAssetsQuery([denom]);
}

export function useAssetPriceQuery(denom: string) {
  return useAssetPricesQuery([denom]);
}
