import type {
  AxelarCosmosChainConfig,
  ChainConfigs,
  ChainConfigsResponse,
} from "@axelarjs/api/axelar-config/types";

import { bech32 } from "bech32";
import { isAddress } from "viem";

export function validateAddress(
  destinationAddress: string,
  chainConfig: ChainConfigs
) {
  const { module } = chainConfig;
  if (module === "evm") return isAddress(destinationAddress);

  try {
    const { addressPrefix } = (chainConfig as AxelarCosmosChainConfig)
      .cosmosConfigs;
    return bech32.decode(destinationAddress).prefix === addressPrefix;
  } catch (e) {
    return false;
  }
}
export function validateChainIds(
  chainIds: string[],
  chainConfigs: ChainConfigsResponse
) {
  chainIds.forEach((chainId) => {
    if (!chainConfigs.chains[chainId.toLowerCase()])
      throw new Error(`chain ID ${chainId} does not exist`);
  });
}

export function validateAsset(
  chainIds: string[],
  assetId: string,
  chainConfigs: ChainConfigsResponse
) {
  chainIds.forEach((chainId) => {
    const chainConfig = chainConfigs.chains[chainId.toLowerCase()];

    if (!chainConfig?.assets.find(({ id }) => id === assetId))
      throw new Error(
        `asset ID ${assetId} does not exist on chain ${chainConfig?.id}`
      );
  });
}
