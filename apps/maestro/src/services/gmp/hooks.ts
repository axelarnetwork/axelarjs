import { Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { trpc } from "~/lib/trpc";
import { filterEligibleChains } from "~/lib/utils/chains";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";

export function useInterchainTokensQuery(input: {
  chainId?: number;
  tokenAddress?: string;
  strict?: boolean;
}) {
  const { combinedComputed, isLoading, isError, error, isFetching } =
    useAllChainConfigsQuery();

  const {
    data,
    isFetching: isFetchingSearch,
    ...queryResult
  } = trpc.interchainToken.searchInterchainToken.useQuery(
    {
      chainId: Maybe.of(input.chainId).mapOrUndefined(Number),
      tokenAddress: input.tokenAddress as `0x${string}`,
      strict: input.strict,
    },
    {
      enabled: Maybe.of(input.tokenAddress).mapOr(false, Boolean),
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const matchingTokens = data?.matchingTokens || [];

  const destinationChainConfigs = matchingTokens
    .map((token) => {
      // prefer axelarChainId index; fallback to numeric chain_id index
      return (
        combinedComputed.indexedById[token.axelarChainId] ||
        combinedComputed.indexedByChainId[token.chainId]
      );
    })
    .filter(Boolean);

  const eligibleChainConfigs = input.chainId
    ? filterEligibleChains(destinationChainConfigs, input.chainId)
    : destinationChainConfigs;

  const topLevelChain = useMemo(() => {
    // try direct route-provided chainId
    const direct = input.chainId
      ? combinedComputed.indexedByChainId[input.chainId]
      : undefined;
    if (direct) return direct;

    // try from result axelarChainId
    const byAxelarId = data?.axelarChainId
      ? combinedComputed.indexedById[data.axelarChainId]
      : undefined;
    if (byAxelarId) return byAxelarId;

    // try from result numeric chainId
    const byNumeric = data?.chainId
      ? combinedComputed.indexedByChainId[data.chainId]
      : undefined;
    return byNumeric;
  }, [
    combinedComputed.indexedByChainId,
    combinedComputed.indexedById,
    data?.axelarChainId,
    data?.chainId,
    input.chainId,
  ]);

  return {
    ...queryResult,
    data: {
      ...data,
      matchingTokens: data?.matchingTokens
        ?.filter((token) => {
          return (
            !!eligibleChainConfigs.find((x) => x.id === token.axelarChainId) ||
            token.chainId === input.chainId
          );
        })
        .map((token) => ({
          ...token,
          chain:
            combinedComputed.indexedById[token.axelarChainId ?? ""] ||
            combinedComputed.indexedByChainId[token.chainId],
          wagmiConfig: combinedComputed.wagmiChains?.find(
            (x) => x?.id === Number(token.chainId)
          ),
        })),
      chain: topLevelChain,
      wagmiConfig: Maybe.of(input.chainId)
        .map(Number)
        .mapOrUndefined((chainId) =>
          combinedComputed.wagmiChains?.find((x) => x?.id === chainId)
        ),
    },
    isLoading,
    isFetching: isFetching || isFetchingSearch,
    isError,
    error,
  };
}

export function useGetTransactionStatusOnDestinationChainsQuery(
  input: {
    txHash: string;
  },
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const { data, ...query } =
    trpc.gmp.getTransactionStatusOnDestinationChains.useQuery(
      {
        txHash: input.txHash,
      },
      {
        refetchInterval: options?.refetchInterval ?? 1000 * 10, // 10 seconds
        enabled: !!input.txHash && (options?.enabled || true),
      }
    );

  return {
    ...query,
    data: data ?? {},
    computed: useMemo(() => {
      const statuses = Object.values(data ?? {});

      return {
        chains: statuses.length,
        executed: statuses.filter((x) => x.status === "executed").length,
      };
    }, [data]),
  };
}

export function useGetTransactionsStatusesOnDestinationChainsQuery(
  input: {
    txHashes?: string[];
  },
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const { data, ...query } =
    trpc.gmp.getTransactionStatusesOnDestinationChains.useQuery(
      {
        txHashes: input.txHashes as `0x${string}`[],
      },
      {
        enabled: Boolean(input.txHashes?.every((txHash) => txHash)),
        refetchInterval: 1000 * 10,
        ...options,
      }
    );

  return {
    ...query,
    data: data ?? {},
    computed: useMemo(() => {
      const statuses = Object.values(data ?? {});

      return {
        chains: statuses.length,
        executed: statuses.filter((x) => x.status === "executed").length,
      };
    }, [data]),
  };
}
