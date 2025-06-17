import { trpc } from "~/lib/trpc";
import type {
  EstimateGasFeeInput,
  EstimateGasFeeMultipleChainsInput,
  GetChainInfoInput,
} from "~/server/routers/axelarjsSDK";

const staleTime = 1000 * 60 * 2; // 2 minutes

export function useEstimateGasFeeQuery(input: EstimateGasFeeInput) {
  return trpc.axelarjsSDK.estimateGasFee.useQuery(input, {
    enabled:
      Boolean(input.destinationChainId) &&
      input.destinationChainId !== "undefined",
    staleTime: 0,
  });
}

export function useEstimateGasFeeMultipleChainsQuery(
  input: EstimateGasFeeMultipleChainsInput
) {
  return trpc.axelarjsSDK.estimateGasFeesMultipleChains.useQuery(input, {
    enabled: Boolean(input.destinationChainIds?.length),
    staleTime: 0,
  });
}

export function useChainInfoQuery(input: GetChainInfoInput) {
  return trpc.axelarjsSDK.getChainInfo.useQuery(input, {
    staleTime,
    enabled: Boolean(input.axelarChainId),
  });
}
