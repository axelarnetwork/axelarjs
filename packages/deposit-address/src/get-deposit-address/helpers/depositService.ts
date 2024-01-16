import { ChainConfigsResponse } from "@axelarjs/api";

export function unwrappable(
  sourceChain: string,
  destinationChain: string,
  asset: string,
  chainConfigs: ChainConfigsResponse
) {
  const sourceChainConfig = chainConfigs.chains[sourceChain.toLowerCase()];
  const destinationChainConfig =
    chainConfigs.chains[destinationChain.toLowerCase()];

  if (!sourceChainConfig || !destinationChainConfig) return false;

  // Do not allow unwrapping to non-EVM chains
  if (destinationChainConfig.module !== "evm") return false;

  const evmDestinationChainConfig = destinationChainConfig;

  const srcAsset = sourceChainConfig.assets.find(({ id }) => id === asset);

  if (!srcAsset) false;

  const isOriginChainMatchedDestinationChain =
    srcAsset?.originChainId.internal === evmDestinationChainConfig.id;
  console.log(isOriginChainMatchedDestinationChain);
  return false;
  // const isNativeAsset = evmDestinationChainConfig.
}
