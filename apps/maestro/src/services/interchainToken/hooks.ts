import { Maybe } from "@axelarjs/utils";

import { trpc } from "~/lib/trpc";

export function useInterchainTokenDetailsQuery(input: {
  chainId?: number;
  tokenAddress?: string | null;
}) {
  return trpc.interchainToken.getInterchainTokenDetails.useQuery(
    {
      chainId: Maybe.of(input.chainId).mapOr(0, Number),
      tokenAddress: String(input.tokenAddress),
    },
    {
      enabled: !!input.tokenAddress,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
    }
  );
}

export function useInterchainTokenBalanceForOwnerQuery(input: {
  chainId?: number;
  tokenAddress?: string;
  owner?: string;
  disabled?: boolean;
}) {
  return trpc.interchainToken.getInterchainTokenBalanceForOwner.useQuery(
    {
      chainId: Number(input.chainId),
      tokenAddress: String(input.tokenAddress),
      owner: String(input.owner),
    },
    {
      enabled:
        !input.disabled &&
        Boolean(input.chainId) &&
        parseInt(String(input.tokenAddress), 16) !== 0,
    }
  );
}
