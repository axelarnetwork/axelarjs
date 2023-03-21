import { useQuery } from "wagmi";

import { estimateGasFee, estimateGasFeeMultipleChains } from "./index";
import {
  EstimateGasFeeMultipleChainsParams,
  EstimateGasFeeParams,
} from "./types";

export function useEstimateGasFee(params: EstimateGasFeeParams) {
  return useQuery(
    ["estimate-gas-fee", params],
    estimateGasFee.bind(null, params)
  );
}

export function useEstimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsParams
) {
  return useQuery(
    ["estimate-gas-fee-multiple-chains", params],
    estimateGasFeeMultipleChains.bind(null, params)
  );
}
