import { Maybe } from "@axelarjs/utils";
import { useEffect, useState } from "react";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
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
    }
  );
}

export function useRpcHealthStatusQuery() {
  return trpc.healthcheck.getRpcStatus.useQuery(
    {
      env: NEXT_PUBLIC_NETWORK_ENV,
    },
    {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: true,
    }
  );
}

export function useSingleRpcHealthStatus(chainName: string | undefined) {
  const [status, setStatus] = useState<"up" | "down" | "timeout" | "unknown">("unknown");
  const [isLoading, setIsLoading] = useState(false);

  const query = trpc.healthcheck.getSingleRpcStatus.useQuery(
    {
      env: NEXT_PUBLIC_NETWORK_ENV,
      chainName: chainName || "",
    },
    {
      enabled: Boolean(chainName),
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: true,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    }
  );

  useEffect(() => {
    if (query.data) {
      setStatus(query.data.status);
      setIsLoading(false);
    }
  }, [query.data]);

  useEffect(() => {
    if (query.isFetching) {
      setIsLoading(true);
    }
  }, [query.isFetching]);

  return {
    status,
    isLoading: isLoading || query.isLoading,
    refetch: query.refetch,
  };
}
