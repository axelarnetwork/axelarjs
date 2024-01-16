import type { ChainConfig } from "@axelarjs/api";

import {
  getDepositAddressFromAxelarNetwork,
  validateAddress,
  validateAsset,
  validateChainIds,
} from "./helpers";
import type {
  DepositNativeUnwrapOptions,
  DepositNativeWrapOptions,
  GetDepositAddressDependencies,
  GetDepositServiceDependencies,
  SendOptions,
} from "./types";

export async function getDepositAddress(
  params: SendOptions,
  dependencies: GetDepositAddressDependencies
) {
  const chainConfigs = await dependencies.configClient.getChainConfigs(
    params.environment
  );

  /**
   * input validation
   */
  validateChainIds([params.sourceChain, params.destinationChain], chainConfigs);
  validateAsset(
    [params.sourceChain, params.destinationChain],
    params.asset,
    chainConfigs
  );
  validateAddress(
    params.destinationAddress,
    chainConfigs.chains[params.destinationChain.toLowerCase()] as ChainConfig
  );

  return getDepositAddressFromAxelarNetwork(params, chainConfigs, dependencies);
}

export async function getNativeWrapDepositAddress(
  params: DepositNativeWrapOptions,
  dependencies: GetDepositServiceDependencies
) {
  const chainConfigs = await dependencies.configClient.getChainConfigs(
    params.environment
  );

  validateChainIds([params.sourceChain, params.destinationChain], chainConfigs);
  validateAddress(
    params.destinationAddress,
    chainConfigs.chains[params.destinationChain.toLowerCase()] as ChainConfig
  );

  const { address } =
    await dependencies.depositServiceClient.getDepositAddressForNativeWrap({
      refundAddress: params.refundAddress,
      destinationAddress: params.destinationAddress,
      fromChain: params.sourceChain,
      toChain: params.destinationChain,
      salt: params.salt,
    });

  return address;
}

export async function getNativeUnwrapDepositAddress(
  params: DepositNativeUnwrapOptions,
  dependencies: GetDepositServiceDependencies
) {
  const chainConfigs = await dependencies.configClient.getChainConfigs(
    params.environment
  );

  validateChainIds([params.sourceChain, params.destinationChain], chainConfigs);
  validateAddress(
    params.destinationAddress,
    chainConfigs.chains[params.destinationChain.toLowerCase()] as ChainConfig
  );

  const { address } =
    await dependencies.depositServiceClient.getDepositAddressForNativeUnwrap({
      refundAddress: params.refundAddress,
      destinationAddress: params.destinationAddress,
      fromChain: params.sourceChain,
      toChain: params.destinationChain,
    });

  return address;
}
