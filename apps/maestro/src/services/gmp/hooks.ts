import { Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { isAddress } from "viem";

import { trpc } from "~/lib/trpc";
import { hex64 } from "~/lib/utils/validation";
import { useEVMChainConfigsQuery } from "../axelarscan/hooks";

export function useInterchainTokensQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
  strict?: boolean;
}) {
  const { computed, ...evmChainsQuery } = useEVMChainConfigsQuery();

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
        chain: computed.indexedById[token.axelarChainId ?? ""],
        wagmiConfig: computed.wagmiChains?.find(
          (x) => x?.id === Number(token.chainId)
        ),
      })),
      chain: Maybe.of(input.chainId).mapOrUndefined(
        (x) => computed.indexedByChainId[x]
      ),
      wagmiConfig: computed.wagmiChains?.find(
        (x) => x?.id === Number(input.chainId)
      ),
    },
    isLoading: evmChainsQuery.isLoading || queryResult.isLoading,
    isFetching: evmChainsQuery.isFetching || queryResult.isFetching,
    isError: evmChainsQuery.isError || queryResult.isError,
    error: evmChainsQuery.error || queryResult.error,
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
        enabled:
          !!input.txHash &&
          hex64().safeParse(input.txHash).success &&
          (options?.enabled || true),
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
        enabled: Boolean(
          input.txHashes?.every((txHash) => txHash.match(/^(0x)?[0-9a-f]{64}/i))
        ),
        refetchInterval: 1000 * 10, // 10 seconds
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
