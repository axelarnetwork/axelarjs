import {
  AxelarQueryAPI,
  importS3Config as getChainConfigs,
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

async function estimateGasFee({
  totalFeeMultiplier,
  estimateGasFeeParams,
}: EstimateGasFeeInput): Promise<bigint> {
  const hopParams = [
    {
      ...estimateGasFeeParams,
      destinationChain: "axelar",
      gasLimit: estimateGasFeeParams.gasLimit.toString(),
    },
    {
      ...estimateGasFeeParams,
      sourceChain: "axelar",
      gasLimit: estimateGasFeeParams.gasLimit.toString(),
    },
  ];

  const fee = await client.estimateMultihopFee(hopParams);

  // FEE_MULTIPLIER is a number with 3 decimals max e.g. 1.875
  // TODO: find a better way to handle conditional gas fee based on the destination chain
  let multiplier = totalFeeMultiplier || FEE_MULTIPLIER;

  if (estimateGasFeeParams.destinationChain.includes("stellar")) {
    multiplier = 1.5;
  }

  const finalValue =
    (BigInt(fee as string) * BigInt(multiplier * 1000)) / 1000n;

  return finalValue;
}

async function estimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsInput
) {
  const results = await Promise.all([
    ...params.estimateGasFeeParams.destinationChainIds.map((destinationChain) =>
      estimateGasFee({
        ...params,
        estimateGasFeeParams: {
          ...params.estimateGasFeeParams,
          destinationChain,
        },
      })
        .then((fee) => {
          // temporary fix to multiply the gas fee for ethereum-sepolia by 2.5 - prevent insufficient gas error
          let adjustedFee = fee;
          if (destinationChain === "ethereum-sepolia") {
            adjustedFee = (fee * 5n) / 2n;
          }

          return {
            status: "success" as const,
            fee: adjustedFee,
            sourceChain: params.estimateGasFeeParams.sourceChain,
            destinationChain,
          };
        })
        .catch((error) => ({
          status: "error" as const,
          error: error instanceof Error ? error.message : "Unknown error",
          fee: 0n,
          sourceChain: params.estimateGasFeeParams.sourceChain,
          destinationChain,
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
  const configs = await getChainConfigs(
    process.env.NEXT_PUBLIC_NETWORK_ENV as Environment
  );

  if (!configs || !configs.chains) {
    throw new Error("No chain configs found");
  }

  const targetChain = Object.values(configs.chains).find(
    (chain: any) => chain.id === params.axelarChainId
  ) as
    | {
        id: string;
        displayName: string;
        approxFinalityHeight: number;
        config: { approxFinalityWaitTime: number };
      }
    | undefined;

  if (!targetChain || !targetChain.config) {
    throw new Error(`Could not find chain config for ${params.axelarChainId}`);
  }

  return {
    id: targetChain.id,
    chainName: targetChain.displayName,
    confirmLevel: targetChain.approxFinalityHeight,
    estimatedWaitTime: targetChain.config.approxFinalityWaitTime,
  };
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
