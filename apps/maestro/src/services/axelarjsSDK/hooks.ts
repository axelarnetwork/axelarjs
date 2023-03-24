import { useQuery } from "wagmi";

import { estimateGasFee, estimateGasFeeMultipleChains } from "./index";
import {
  EstimateGasFeeMultipleChainsParams,
  EstimateGasFeeParams,
} from "./types";

const staleTime = 1000 * 60 * 3; // 3 minutes

export function useEstimateGasFee(params: EstimateGasFeeParams) {
  return useQuery(
    ["estimate-gas-fee", params],
    estimateGasFee.bind(null, params),
    { staleTime }
  );
}

export function useEstimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsParams
) {
  return useQuery(
    ["estimate-gas-fee-multiple-chains", params],
    estimateGasFeeMultipleChains.bind(null, params),
    { staleTime }
  );
}
