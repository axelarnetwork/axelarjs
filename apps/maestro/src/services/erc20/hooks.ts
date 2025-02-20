import { Maybe } from "@axelarjs/utils";

import { isAddress } from "viem";

import { trpc } from "~/lib/trpc";

export function useERC20TokenDetailsQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
}) {
  return trpc.erc20.getERC20TokenDetails.useQuery(
    {
      chainId: Maybe.of(input.chainId).mapOrUndefined(Number),
      tokenAddress: String(input.tokenAddress),
    },
    {
      enabled: !!input.tokenAddress,
      retry: false,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
    }
  );
}

export function useERC20TokenBalanceForOwnerQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
  owner?: `0x${string}`;
}) {
  return trpc.interchainToken.getInterchainTokenBalanceForOwner.useQuery(
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
        parseInt(String(input.tokenAddress), 16) !== 0,
    }
  );
}
