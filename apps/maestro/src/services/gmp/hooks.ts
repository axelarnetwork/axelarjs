import { Maybe } from "@axelarjs/utils";
import { useMemo } from "react";
import { isAddress } from "viem";

import { trpc } from "~/lib/trpc";
import { hex64 } from "~/lib/utils/validation";
import { useEVMChainConfigsQuery, useVMChainConfigsQuery } from "../axelarscan/hooks";

export function useInterchainTokensQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
  strict?: boolean;
}) {
  const { computed: evmComputed, ...evmChainsQuery } = useEVMChainConfigsQuery();
  const { computed: vmComputed, ...vmChainsQuery } = useVMChainConfigsQuery();

  const combinedComputed = useMemo(() => ({
    indexedById: {
      ...evmComputed.indexedById,
      ...vmComputed.indexedById,
    },
    indexedByChainId: {
      ...evmComputed.indexedByChainId,
      ...vmComputed.indexedByChainId,
    },
    wagmiChains: evmComputed.wagmiChains, // Keep wagmiChains for EVM compatibility
  }), [evmComputed, vmComputed]);

  const { data, ...queryResult } =
    trpc.interchainToken.searchInterchainToken.useQuery(
      {
        chainId: Maybe.of(input.chainId).mapOrUndefined(Number),
        tokenAddress: input.tokenAddress as `0x${string}`,
        strict: input.strict,
      },
      {
        enabled: Maybe.of(input.tokenAddress).mapOr(false, isAddress),
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
        wagmiConfig: combinedComputed.wagmiChains?.find((x) => x?.id === Number(token.chainId))
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
    isLoading: evmChainsQuery.isLoading || vmChainsQuery.isLoading || queryResult.isLoading,
    isFetching: evmChainsQuery.isFetching || vmChainsQuery.isFetching || queryResult.isFetching,
    isError: evmChainsQuery.isError || vmChainsQuery.isError || queryResult.isError,
    error: evmChainsQuery.error || vmChainsQuery.error || queryResult.error,
  };
}

export function useGetTransactionStatusOnDestinationChainsQuery(
  input: {
    txHash?: `0x${string}`;
  },
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const { data, ...query } =
    trpc.gmp.getTransactionStatusOnDestinationChains.useQuery(
      {
        txHash: input.txHash as `0x${string}`,
      },
      {
        refetchInterval: 1000 * 10,
        enabled:
          input.txHash &&
          hex64().safeParse(input.txHash).success &&
          Maybe.of(options?.enabled).mapOr(true, Boolean),
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
    txHashes?: `0x${string}`[];
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
        enabled: Boolean(
          input.txHashes?.every((txHash) => txHash.match(/^(0x)?[0-9a-f]{64}/i))
        ),
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
