import {
  AxelarQueryAPI,
  type Environment,
  type GasToken,
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
  const fee = BigInt(
    await client.estimateGasFee(
      params.sourceChainId,
      params.destinationChainId,
      params.sourceChainTokenSymbol,
      params.gasLimit,
      params.gasMultipler,
      params.minGasPrice,
      params.isGMPExpressTransaction
    )
  );

  return fee;
}

async function estimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsParams
): Promise<bigint[]> {
  return await Promise.all([
    ...params.destinationChainIds.map((destinationChainId) =>
      estimateGasFee({
        ...params,
        destinationChainId,
        sourceChainTokenSymbol: getNativeToken(
          params.sourceChainId
        ) as GasToken,
      })
    ),
  ]);
}

const extendedClient = {
  ...client,
  estimateGasFee,
  estimateGasFeeMultipleChains,
};

export default extendedClient;

export { estimateGasFee, estimateGasFeeMultipleChains };
