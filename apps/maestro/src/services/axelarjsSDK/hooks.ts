import { trpc } from "~/lib/trpc";
import type {
  EstimateGasFeeMultipleChainsParams,
  EstimateGasFeeParams,
} from "./types";

const staleTime = 1000 * 60 * 2; // 2 minutes

export function useEstimateGasFee(params: EstimateGasFeeParams) {
  return trpc.axelarjsSDK.estimateGasFee.useQuery(params, {
    staleTime,
    enabled: Boolean(params.destinationChainId),
  });
}

export function useEstimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsParams
) {
  return trpc.axelarjsSDK.estimateGasFeesMultipleChains.useQuery(params, {
    staleTime,
    enabled: Boolean(params.destinationChainIds),
  });
}
