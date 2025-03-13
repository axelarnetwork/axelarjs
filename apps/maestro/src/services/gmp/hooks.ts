import { Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { trpc } from "~/lib/trpc";
import { useAllChainConfigsQuery } from "../axelarscan/hooks";

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

  return {
    ...queryResult,
    data: {
      ...data,
      matchingTokens: data?.matchingTokens.map((token) => ({
        ...token,
        chain: combinedComputed.indexedById[token.axelarChainId ?? ""],
        wagmiConfig: combinedComputed.wagmiChains?.find(
          (x) => x?.id === Number(token.chainId)
        ),
      })),
      chain: Maybe.of(input.chainId).mapOrUndefined(
        (x) => combinedComputed.indexedByChainId[x]
      ),
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
