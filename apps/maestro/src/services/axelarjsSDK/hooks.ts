import { trpc } from "~/lib/trpc";
import type {
  EstimateGasFeeInput,
  EstimateGasFeeMultipleChainsInput,
  GetChainInfoInput,
} from "~/server/routers/axelarjsSDK";

const staleTime = 1000 * 60 * 2; // 2 minutes

type UseEstimateGasFeeQueryInput =
  EstimateGasFeeInput["estimateGasFeeParams"] & {
    totalFeeMultiplier: EstimateGasFeeInput["totalFeeMultiplier"];
  };

export function useEstimateGasFeeQuery(input: UseEstimateGasFeeQueryInput) {
  const { totalFeeMultiplier, ...estimateGasFeeParams } = input;

  return trpc.axelarjsSDK.estimateGasFee.useQuery(
    {
      estimateGasFeeParams,
      totalFeeMultiplier,
    },
    {
      enabled:
        Boolean(input.destinationChain) &&
        input.destinationChain !== "undefined",
      staleTime: 1000,
    }
  );
}

type UseEstimateGasFeeMultipleChainsQueryInput =
  EstimateGasFeeMultipleChainsInput["estimateGasFeeParams"] & {
    totalFeeMultiplier: EstimateGasFeeMultipleChainsInput["totalFeeMultiplier"];
  };

export function useEstimateGasFeeMultipleChainsQuery(
  input: UseEstimateGasFeeMultipleChainsQueryInput
) {
  const { totalFeeMultiplier, ...estimateGasFeeParams } = input;

  return trpc.axelarjsSDK.estimateGasFeesMultipleChains.useQuery(
    {
      estimateGasFeeParams,
      totalFeeMultiplier,
    },
    {
      enabled: Boolean(estimateGasFeeParams.destinationChainIds?.length),
      staleTime: 1000,
    }
  );
}

export function useChainInfoQuery(input: GetChainInfoInput) {
  return trpc.axelarjsSDK.getChainInfo.useQuery(input, {
    staleTime,
    enabled: Boolean(input.axelarChainId),
  });
}
