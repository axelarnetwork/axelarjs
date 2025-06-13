import { trpc } from "~/lib/trpc";
import type {
  EstimateGasFeeInput,
  EstimateGasFeeMultipleChainsInput,
  GetChainInfoInput,
} from "~/server/routers/axelarjsSDK";

const staleTime = 1000 * 60 * 2; // 2 minutes

export function useEstimateGasFeeQuery(input: EstimateGasFeeInput) {
  return trpc.axelarjsSDK.estimateGasFee.useQuery(input, {
    staleTime: 1000,
    enabled:
      Boolean(input.destinationChainId) &&
      input.destinationChainId !== "undefined",
  });
}

export function useEstimateGasFeeMultipleChainsQuery(
  input: EstimateGasFeeMultipleChainsInput
) {
  return trpc.axelarjsSDK.estimateGasFeesMultipleChains.useQuery(input, {
    staleTime: 1000,
    enabled: Boolean(input.destinationChainIds?.length),
  });
}

export function useChainInfoQuery(input: GetChainInfoInput) {
  return trpc.axelarjsSDK.getChainInfo.useQuery(input, {
    staleTime,
    enabled: Boolean(input.axelarChainId),
  });
}
