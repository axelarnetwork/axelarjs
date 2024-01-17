import type { ChainConfig } from "@axelarjs/api";

import {
  getActiveChains,
  getDepositAddressFromAxelarNetwork,
  unwrappable,
  validateActiveChains,
  validateAddress,
  validateAsset,
  validateChainIds,
} from "./helpers";
import type {
  DepositAddressOptions,
  DepositNativeUnwrapOptions,
  DepositNativeWrapOptions,
  GetDepositAddressDependencies,
  GetDepositServiceDependencies,
  GetLinkedDepositAddressDependencies,
  SendOptions,
} from "./types";

export async function getDepositAddress(
  params: DepositAddressOptions,
  dependencies: GetDepositAddressDependencies
) {
  const {
    asset,
    sourceChain,
    destinationChain,
    environment,
    destinationAddress,
  } = params;

  const chainConfigs = await dependencies.configClient.getChainConfigs(
    params.environment
  );

  // we consider undefined asset as a native token asset
  if (!asset) {
    // returns the native wrap deposit address
    return getNativeWrapDepositAddress(
      {
        destinationAddress,
        sourceChain,
        destinationChain,
        environment,
        salt: params.options?.salt,
        refundAddress: params.options?.refundAddress || destinationAddress,
      },
      dependencies
    );
  } else {
    // this is an erc20 token, we need to check if it is unwrappable at the destination chain
    const shouldUnwrapToken = unwrappable(
      destinationChain,
      asset,
      chainConfigs
    );

    // define a function to get the linked deposit address based on the destination address, where:
    // - if the token is unwrappable, we need to get the native unwrap deposit address
    // - otherwise, we need to get the linked deposit address
    const _getLinkedDepositAddress = (destinationAddress: string) =>
      getLinkedDepositAddress(
        {
          destinationAddress,
          sourceChain,
          destinationChain,
          environment,
          asset,
        },
        dependencies
      ).then((res) => res?.depositAddress);

    if (shouldUnwrapToken && !params.options?.skipUnwrap) {
      // the token is unwrappable, we need to get the native unwrap deposit address first.
      const unwrappedDepositAddress = await getNativeUnwrapDepositAddress(
        {
          destinationAddress,
          sourceChain,
          destinationChain,
          environment,
          refundAddress:
            params.options?.refundAddress || params.destinationAddress,
        },
        dependencies
      );

      // then, we need to get the linked deposit address based on the unwrapped deposit address and return it
      return _getLinkedDepositAddress(unwrappedDepositAddress);
    } else {
      // the token is not unwrappable, we can get the linked deposit address directly and return it
      return _getLinkedDepositAddress(params.destinationAddress);
    }
  }
}

export async function getLinkedDepositAddress(
  params: SendOptions,
  dependencies: GetLinkedDepositAddressDependencies
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

  const activeChains = await getActiveChains(params.environment);
  validateActiveChains(
    [params.sourceChain, params.destinationChain],
    activeChains
  );

  const { address } =
    await dependencies.depositServiceClient.getDepositAddressForNativeWrap({
      refundAddress: params.refundAddress,
      destinationAddress: params.destinationAddress,
      fromChain: params.sourceChain,
      toChain: params.destinationChain,
      salt: params.salt || "0x", // we would like to re-used the same salt to utilize the same deposit address
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

  const activeChains = await getActiveChains(params.environment);
  validateActiveChains(
    [params.sourceChain, params.destinationChain],
    activeChains
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
