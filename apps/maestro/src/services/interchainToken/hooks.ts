import { isAddress } from "viem";

import { trpc } from "~/lib/trpc";

export function useInterchainTokenDetailsQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
}) {
  return trpc.interchainToken.getInterchainTokenDetails.useQuery(
    {
      chainId: Number(input.chainId),
      tokenAddress: String(input.tokenAddress),
    },
    {
      enabled: Boolean(input.chainId) && isAddress(input.tokenAddress ?? ""),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
    }
  );
}

export function useInterchainTokenBalanceForOwnerQuery(input: {
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
