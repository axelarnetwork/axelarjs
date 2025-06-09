import { Maybe } from "@axelarjs/utils";

import { trpc } from "~/lib/trpc";

export function useNativeTokenDetailsQuery(input: {
  chainId?: number;
  tokenAddress?: string;
}) {
  return trpc.nativeTokens.getNativeTokenDetails.useQuery(
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
