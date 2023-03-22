import { AxelarQueryAPI, Environment } from "@axelar-network/axelarjs-sdk";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

import { getNativeToken } from "~/utils/getNativeToken";

import type {
  EstimateGasFeeMultipleChainsParams,
  EstimateGasFeeParams,
} from "./types";

export const client = new AxelarQueryAPI({
  environment: process.env.NEXT_PUBLIC_NETWORK_ENV as Environment,
});

async function estimateGasFee(
  params: EstimateGasFeeParams
): Promise<BigNumber> {
  const fee = BigNumber.from(
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
  console.log("estimateGasFee", formatEther(fee), params);
  return fee;
}

async function estimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsParams
): Promise<BigNumber[]> {
  return await Promise.all(
    params.destinationChainIds.map((destinationChainId) =>
      estimateGasFee({
        ...params,
        destinationChainId,
        sourceChainTokenSymbol: getNativeToken(params.sourceChainId),
      })
    )
  );
}

const extendedClient = {
  ...client,
  estimateGasFee,
  estimateGasFeeMultipleChains,
};

export default extendedClient;

export { estimateGasFee, estimateGasFeeMultipleChains };
