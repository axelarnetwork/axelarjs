import { Maybe } from "@axelarjs/utils";

import { trpc } from "~/lib/trpc";

export function useGetChainsConfig(input: { axelarChainId?: string }) {
  return trpc.axelarConfigs.getChainConfigs.useQuery(
    {
      axelarChainId: Maybe.of(input.axelarChainId).mapOr("", String),
    },
    {
      enabled: Boolean(input.axelarChainId),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
    },
  );
}
