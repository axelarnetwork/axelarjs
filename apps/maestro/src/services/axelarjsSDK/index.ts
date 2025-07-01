import {
  AxelarQueryAPI,
  loadChains as getChainConfigs,
  type Environment,
} from "@axelar-network/axelarjs-sdk";

import { FEE_MULTIPLIER } from "~/config/env";
import type {
  EstimateGasFeeInput,
  EstimateGasFeeMultipleChainsInput,
  GetChainInfoInput,
} from "~/server/routers/axelarjsSDK";

export const client = new AxelarQueryAPI({
  environment: process.env.NEXT_PUBLIC_NETWORK_ENV as Environment,
});

async function estimateGasFee(params: EstimateGasFeeInput): Promise<bigint> {
  const hopParams = [
    {
      ...params,
      sourceChain: params.sourceChainId,
      destinationChain: "axelar",
      gasLimit: params.gasLimit.toString(),
    },
    {
      ...params,
      sourceChain: "axelar",
      destinationChain: params.destinationChainId,
      gasLimit: params.gasLimit.toString(),
    },
  ];

  const fee = await client.estimateMultihopFee(hopParams);

  // FEE_MULTIPLIER is a number with 3 decimals max e.g. 1.875
  // TODO: find a better way to handle conditional gas fee based on the destination chain
  const gasMultiplier = Number(params.gasMultiplier) || FEE_MULTIPLIER;
  const multiplier = params.destinationChainId.includes("stellar")
    ? 1.5
    : gasMultiplier;

  const finalValue =
    (BigInt(fee as string) * BigInt(multiplier * 1000)) / 1000n;

  return finalValue;
}

async function estimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsInput
) {
  const results = await Promise.all([
    ...params.destinationChainIds.map((destinationChainId) =>
      estimateGasFee({
        ...params,
        destinationChainId,
      })
        .then((fee) => {
          // temporary fix to multiply the gas fee for ethereum-sepolia by 2.5 - prevent insufficient gas error
          let adjustedFee = fee;
          if (destinationChainId === "ethereum-sepolia") {
            adjustedFee = (fee * 5n) / 2n;
          }

          return {
            status: "success" as const,
            fee: adjustedFee,
            sourceChainId: params.sourceChainId,
            destinationChainId,
          };
        })
        .catch((error) => ({
          status: "error" as const,
          error: error instanceof Error ? error.message : "Unknown error",
          fee: 0n,
          sourceChainId: params.sourceChainId,
          destinationChainId,
        }))
    ),
  ]);

  const totalGasFee = results.reduce((acc, x) => acc + x.fee, 0n);

  return {
    totalGasFee,
    gasFees: results,
  };
}

// TODO: Find out why do we need chain configs from axelarjs-sdk while we already have them in axelarscan API
async function getChainInfo(params: GetChainInfoInput) {
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
