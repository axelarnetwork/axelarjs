import { trpc } from "~/lib/trpc";
import type {
  EstimateGasFeeMultipleChainsParams,
  EstimateGasFeeParams,
} from "./types";

const staleTime = 1000 * 60 * 2; // 2 minutes

export function useEstimateGasFeeQuery(params: EstimateGasFeeParams) {
  return trpc.axelarjsSDK.estimateGasFee.useQuery(params, {
    staleTime,
    enabled:
      Boolean(params.destinationChainId) &&
      params.destinationChainId !== "undefined",
  });
}

export function useEstimateGasFeeMultipleChainsQuery(
  params: EstimateGasFeeMultipleChainsParams
) {
  return trpc.axelarjsSDK.estimateGasFeesMultipleChains.useQuery(params, {
    staleTime,
    enabled: Boolean(params.destinationChainIds),
  });
}
