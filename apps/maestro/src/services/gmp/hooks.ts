import type { GMPTxStatus, SearchGMPParams } from "@axelarjs/api/gmp";
import { Maybe } from "@axelarjs/utils";
import { useMemo } from "react";

import { uniq } from "rambda";
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
  return useQuery(["gmp-contracts"], gmpClient.getContracts);
}

export function useInterchainTokensQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
  chainIds?: number[];
}) {
  const {
    data: evmChains,
    computed,
    ...evmChainsQuery
  } = useEVMChainConfigsQuery();

  const uniqueChainsIDs = uniq(evmChains?.map?.((x) => x.chain_id) ?? []);

  const { data, ...queryResult } =
    trpc.interchainToken.searchInterchainToken.useQuery(
      {
        chainId: Maybe.of(input.chainId).mapOrUndefined(Number),
        tokenAddress: String(input.tokenAddress),
        chainIds: input.chainIds ?? uniqueChainsIDs,
      },
      {
        enabled:
          isAddress(input.tokenAddress ?? "") &&
          Boolean(input.chainIds?.length || uniqueChainsIDs.length),
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
        chain: computed.indexedByChainId[String(token.chainId)],
        wagmiConfig: computed.wagmiChains?.find(
          (x) => x?.id === Number(token.chainId)
        ),
      })),
      chain: computed.indexedByChainId[String(input.chainId)],
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
    txHash?: `0x${string}`;
  },
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const { data, ...query } = useQuery(
    ["gmp-get-transaction-status-on-destination-chains", input],
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
