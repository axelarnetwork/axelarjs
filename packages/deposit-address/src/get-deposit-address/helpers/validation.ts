import type {
  ChainConfig,
  ChainConfigsResponse,
} from "@axelarjs/api/axelar-config/types";
import { Environment } from "@axelarjs/core";

import { bech32 } from "bech32";
import { isAddress } from "viem";

import { DepositAddressRequestConfig } from "../types";
import { getActiveChains } from "./depositService";

export async function validateAddressAndChains(
  sourceChain: string,
  destinationChain: string,
  destinationAddress: string,
  chainConfigs: ChainConfigsResponse,
  environment: Environment,
  requestConfig?: DepositAddressRequestConfig
) {
  validateAddress(
    destinationAddress,
    chainConfigs.chains[destinationChain.toLowerCase()] as ChainConfig
  );
  validateChainIds([sourceChain, destinationChain], chainConfigs);

  const activeChains = await getActiveChains(environment, requestConfig);
  validateActiveChains([sourceChain, destinationChain], activeChains);
}

export function validateAddress(
  destinationAddress: string,
  chainConfig: ChainConfig
) {
  const { module } = chainConfig;
  if (module === "evm") {
    if (!isAddress(destinationAddress))
      throw new Error(`${destinationAddress} is not a valid EVM address`);
  } else {
    try {
      const { addressPrefix } = chainConfig.cosmosConfigs;
      if (!(bech32.decode(destinationAddress).prefix === addressPrefix)) {
        throw new Error(
          `${destinationAddress} is not a valid address for ${chainConfig.id}`
        );
      }
    } catch (e) {
      throw new Error(`could not validate this address: ${destinationAddress}`);
    }
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

export function validateActiveChains(
  chainIds: string[],
  activeChains: string[]
) {
  chainIds.forEach((chainId) => {
    if (!activeChains.includes(chainId.toLowerCase()))
      throw new Error(`chain ID ${chainId} is not active`);
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
