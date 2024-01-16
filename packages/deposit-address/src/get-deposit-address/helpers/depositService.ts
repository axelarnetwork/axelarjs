import { ChainConfigsResponse } from "@axelarjs/api";

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
