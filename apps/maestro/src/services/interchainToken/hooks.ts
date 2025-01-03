import { Maybe } from "@axelarjs/utils";

import { isAddress } from "viem";

import { trpc } from "~/lib/trpc";

export function useInterchainTokenDetailsQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}` | null;
}) {
  return trpc.interchainToken.getInterchainTokenDetails.useQuery(
    {
      chainId: Maybe.of(input.chainId).mapOr(0, Number),
      tokenAddress: String(input.tokenAddress),
    },
    {
      enabled: isAddress(input.tokenAddress ?? ""),
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
  return trpc.erc20.getERC20TokenBalanceForOwner.useQuery(
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
