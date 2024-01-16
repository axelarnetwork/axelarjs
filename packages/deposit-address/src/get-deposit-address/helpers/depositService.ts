import { ChainConfigsResponse } from "@axelarjs/api";

import { encodeAbiParameters, keccak256 } from "viem";

export function unwrappable(
  destinationChain: string,
  asset: string,
  chainConfigs: ChainConfigsResponse
) {
  const destinationChainConfig =
    chainConfigs.chains[destinationChain.toLowerCase()];

  if (!destinationChainConfig) return false;

  const destAsset = destinationChainConfig.assets.find(
    ({ id }) => id === asset
  );

  if (destAsset?.module === "evm" && destAsset.isERC20WrappedNativeGasToken) {
    return true;
  }

  return false;
}

export function generateRandomSalt(destinationAddress: string) {
  return keccak256(
    encodeAbiParameters(
      [
        {
          type: "uint256",
          name: "timestamp",
        },
        {
          type: "string",
          name: "destinationAddress",
        },
      ],
      [BigInt(new Date().getTime()), destinationAddress]
    )
  );
}
