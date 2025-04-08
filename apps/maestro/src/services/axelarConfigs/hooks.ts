import { Maybe } from "@axelarjs/utils";

import { trpc } from "~/lib/trpc";
import { useMemo } from "react";

import { indexBy, partition, prop } from "rambda";

import { CHAIN_CONFIGS, WAGMI_CHAIN_CONFIGS } from "~/config/chains";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { logger } from "~/lib/logger";

const CHAIN_CONFIGS_BY_AXELAR_CHAIN_ID = indexBy(prop("id"), CHAIN_CONFIGS);
const WAGMI_CHAIN_CONFIGS_BY_ID = indexBy(prop("id"), WAGMI_CHAIN_CONFIGS);

export function useGetChainsConfig(input: { axelarChainId?: string }) {
  return trpc.axelarConfigs.getChainConfigs.useQuery(
    {
      axelarChainId: Maybe.of(input.axelarChainId).mapOr("", String),
    },
    {
      enabled: Boolean(input.axelarChainId),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
    }
  );
}

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
      wagmiChains: evmComputed.wagmiChains,
    }),
    [evmComputed, vmComputed]
  );

  const allChains = useMemo(() => {
    // Create a lookup map using chain_id as the key
    const chainMap = new Map();

    // Process EVM chains first
    evmChains?.forEach((chain) => {
      chainMap.set(chain.chain_id, chain);
    });

    // Process VM chains, only add if not already present or if it's a special case
    vmChains?.forEach((chain) => {
      const existingChain = chainMap.get(chain.chain_id);
      if (!existingChain || existingChain.id === chain.id) {
        chainMap.set(chain.chain_id, chain);
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
  const { data, ...queryResult } =
    trpc.axelarConfigs.getEvmChainConfigs.useQuery(undefined, {
      staleTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
    });

  // Filter out chains that are not configured in the app
  const [configured, unconfigured] = useMemo(
    () =>
      partition(
        (x) => (x.chain_id) in WAGMI_CHAIN_CONFIGS_BY_ID,
        data ?? []
      ),
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
    (x) => WAGMI_CHAIN_CONFIGS_BY_ID[x.chain_id ?? 0]
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
  const { data, ...queryResult } =
    trpc.axelarConfigs.getVmChainConfigs.useQuery(undefined, {
      staleTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
    });

  // Filter out chains that are not configured in the app
  const [configured, unconfigured] = useMemo(() => {
    return partition(
      (x) => (x.chain_id ?? 0) in CHAIN_CONFIGS_BY_AXELAR_CHAIN_ID,
      data ?? []
    );
  }, [data]);

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

  return {
    ...queryResult,
    data: configured,
    computed: {
      indexedByChainId: indexBy(prop("chain_id"), configured),
      indexedById: indexBy(prop("id"), configured),
    },
  };
}
