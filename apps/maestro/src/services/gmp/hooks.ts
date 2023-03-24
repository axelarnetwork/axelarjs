import { isAddress } from "ethers/lib/utils.js";
import { uniq } from "rambda";
import { useQuery } from "wagmi";

import { trpc } from "~/lib/trpc";

import { useEVMChainConfigsQuery } from "../axelarscan/hooks";
import { getContracts, searchGMP } from "./index";
import { SearchGMPParams } from "./types";

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
  const { data: evmChains, computed } = useEVMChainConfigsQuery();

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
        chain: computed.indexedByChainId[token.chainId],
      })),
    },
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
