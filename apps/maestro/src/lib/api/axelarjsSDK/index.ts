import { AxelarQueryAPI, Environment } from "@axelar-network/axelarjs-sdk";
import { BigNumber } from "ethers";

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
  return BigNumber.from(
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
}

async function estimateGasFeeMultipleChains(
  params: EstimateGasFeeMultipleChainsParams
): Promise<BigNumber[]> {
  let promises: Promise<BigNumber>[] = [];
  params.destinationChainIds.forEach((destinationChainId) => {
    promises.push(
      Promise.resolve(estimateGasFee({ ...params, destinationChainId }))
    );
  });
  return Promise.all(promises);

  //   return await Promise.all(
  //     params.destinationChainIds.map(async (destinationChainId) => {
  //       Promise.resolve(await estimateGasFee({ ...params, destinationChainId }));
  //     })
  //   );
}

export { estimateGasFee, estimateGasFeeMultipleChains };
