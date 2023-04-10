import { useMemo } from "react";

import { constants } from "ethers";
import { isAddress } from "ethers/lib/utils.js";
import { uniq } from "rambda";
import { useQuery } from "wagmi";

import { trpc } from "~/lib/trpc";

import { useEVMChainConfigsQuery } from "../axelarscan/hooks";
import { getContracts, searchGMP } from "./index";
import { GMPStatus, SearchGMPParams } from "./types";

export function useSearchGMPQuery(params: SearchGMPParams) {
  return useQuery(["gmp-search", params], searchGMP.bind(null, params));
}

export function useContractsQuery() {
  return useQuery(["gmp-contracts"], getContracts);
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

  const { data, ...queryResult } = trpc.gmp.searchInterchainToken.useQuery(
    {
      chainId: Number(input.chainId),
      tokenAddress: String(input.tokenAddress),
      chainIds: input.chainIds ?? uniqueChainsIDs,
    },
    {
      enabled:
        Boolean(input.chainId) &&
        isAddress(input.tokenAddress ?? "") &&
        Boolean(input.chainIds?.length || uniqueChainsIDs.length),
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

export function useGetERC20TokenDetailsQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
}) {
  return trpc.gmp.getERC20TokenDetails.useQuery(
    {
      chainId: Number(input.chainId),
      tokenAddress: String(input.tokenAddress),
    },
    {
      enabled: Boolean(input.chainId) && isAddress(input.tokenAddress ?? ""),
    }
  );
}

export function useGetERC20TokenBalanceForOwnerQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
  owner?: `0x${string}`;
}) {
  return trpc.gmp.getERC20TokenBalanceForOwner.useQuery(
    {
      chainId: Number(input.chainId),
      tokenAddress: String(input.tokenAddress),
      owner: String(input.owner),
    },
    {
      enabled:
        Boolean(input.chainId) &&
        isAddress(input.tokenAddress ?? "") &&
        isAddress(input.owner ?? "") &&
        input.tokenAddress !== constants.AddressZero,
    }
  );
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
      const { data } = await searchGMP({
        txHash: input.txHash,
      });

      if (data.length) {
        return data.reduce(
          (acc, { call, status }) => ({
            ...acc,
            [call.returnValues.destinationChain.toLowerCase()]: status,
          }),
          {} as { [chainId: string]: GMPStatus }
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
        executed: statuses.filter((x) => x === "executed").length,
      };
    }, [data]),
  };
}
