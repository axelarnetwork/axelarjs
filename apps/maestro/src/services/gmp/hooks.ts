import type { GMPTxStatus, SearchGMPParams } from "@axelarjs/api/gmp";
import { Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { isAddress } from "viem";
import { useQuery } from "wagmi";

import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "../axelarscan/hooks";
import gmpClient from "./index";

export function useSearchGMPQuery(params: SearchGMPParams) {
  return useQuery(
    ["gmp-search", params],
    gmpClient.searchGMP.bind(null, params)
  );
}

export function useContractsQuery() {
  return useQuery(["gmp-contracts"], gmpClient.getContracts.bind(null));
}

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

export function useGetTransactionType(input: { txHash?: `0x${string}` }) {
  const { data, ...query } = useQuery(
    ["gmp-get-transaction-type", input.txHash],
    async () => {
      const response = await gmpClient.searchGMP({
        txHash: input.txHash,
      });

      if (response.length) {
        if (response[0]["interchain_token_deployment_started"])
          return "INTERCHAIN_DEPLOYMENT" as const;
        if (response[0]["interchain_transfer"])
          return "INTERCHAIN_TRANSFER" as const;
      }

      return null;
    }
  );

  return {
    ...query,
    data,
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
  const { data, ...query } = useQuery(
    ["gmp-get-transaction-status-on-destination-chains", input.txHash],
    async () => {
      const responseData = await gmpClient.searchGMP({
        txHash: input.txHash,
      });

      if (responseData.length) {
        return responseData.reduce(
          (acc, { call, status }) => ({
            ...acc,
            [call.returnValues.destinationChain.toLowerCase()]: {
              status,
              txHash: call.transactionHash,
              logIndex: call.logIndex,
              txId: call.id,
            },
          }),
          {} as {
            [chainId: string]: {
              status: GMPTxStatus;
              txHash: `0x${string}`;
              logIndex: number;
              txId?: string;
            };
          }
        );
      }
      return {};
    },
    {
      enabled: Boolean(input.txHash?.match(/^(0x)?[0-9a-f]{64}/i)),
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

export function useGetTransactionsStatusesOnDestinationChainsQuery(
  input: {
    txHashes?: `0x${string}`[];
  },
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const { data, ...query } = useQuery(
    ["gmp-get-transactions-statuses-on-destination-chains", input.txHashes],
    async () => {
      const results = await Promise.all(
        input.txHashes?.map((txHash) => gmpClient.searchGMP({ txHash })) ?? []
      );

      return results.flat().reduce(
        (acc, { call, status }) => ({
          ...acc,
          [call.returnValues.destinationChain.toLowerCase()]: {
            status,
            txHash: call.transactionHash,
            logIndex: call.logIndex,
            txId: call.id,
          },
        }),
        {} as {
          [chainId: string]: {
            status: GMPTxStatus;
            txHash: `0x${string}`;
            logIndex: number;
            txId?: string;
          };
        }
      );
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
