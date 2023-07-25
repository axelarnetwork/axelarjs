import {
  AxelarQueryAPI,
  loadChains as getChainConfigs,
  type Environment,
} from "@axelar-network/axelarjs-sdk";

import { getNativeToken } from "~/lib/utils/getNativeToken";
import type {
  EstimateGasFeeMultipleChainsParams,
  EstimateGasFeeParams,
} from "./types";

export const client = new AxelarQueryAPI({
  environment: process.env.NEXT_PUBLIC_NETWORK_ENV as Environment,
});

async function estimateGasFee(params: EstimateGasFeeParams): Promise<bigint> {
  const response = await client.estimateGasFee(
    params.sourceChainId,
    params.destinationChainId,
    params.sourceChainTokenSymbol,
    params.gasLimit,
    params.gasMultipler,
    params.minGasPrice
  );

  const rawFee = typeof response === "string" ? response : response.baseFee;

  return BigInt(rawFee);
}

async function estimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsParams
): Promise<bigint[]> {
  return await Promise.all([
    ...params.destinationChainIds.map((destinationChainId) =>
      estimateGasFee({
        ...params,
        destinationChainId,
        sourceChainTokenSymbol: getNativeToken(params.sourceChainId),
      })
    ),
  ]);
}

type EstimateFinalityParams = {
  axelarChainId: string;
};

async function getChainInfo(params: EstimateFinalityParams) {
  const chains = await getChainConfigs({
    environment: process.env.NEXT_PUBLIC_NETWORK_ENV as Environment,
  });

  const chainConfig = chains.find((chain) => chain.id === params.axelarChainId);

  if (!chainConfig) {
    throw new Error(`Could not find chain config for ${params.axelarChainId}`);
  }

  return chainConfig;
}

const extendedClient = {
  ...client,
  estimateGasFee,
  estimateGasFeeMultipleChains,
  getChainConfigs,
  getChainInfo,
};

export default extendedClient;

export { estimateGasFee, estimateGasFeeMultipleChains };
