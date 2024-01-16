import type { /* AxelarEVMChainConfig, */ ChainConfig } from "@axelarjs/api";

import {
  getDepositAddressFromAxelarNetwork,
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
  const chainConfigs = await dependencies.configClient.getChainConfigs(
    params.environment
  );

  console.log("==== The following chains has native wrapped asset =====");
  for (const [k, v] of Object.entries(chainConfigs.chains)) {
    const nativeWrappedAsset = v.assets.find(
      (asset) => asset.module === "evm" && asset.isERC20WrappedNativeGasToken
    );
    if (nativeWrappedAsset) {
      console.log(k);
    }
  }

  const { asset, sourceChain, destinationChain } = params;

  // const destChainConfig = chainConfigs.chains[
  //   destinationChain.toLowerCase()
  // ] as ChainConfig;

  // const srcChainConfig = chainConfigs.chains["arbitrum"] as ChainConfig;

  // if (srcChainConfig.module === "evm" && destChainConfig.module === "evm") {
  //   const srcEvmChainConfig = srcChainConfig as unknown as AxelarEVMChainConfig;
  //   const wrappedNativeAsset = srcEvmChainConfig.assets.find((asset) => {
  //     if (asset.module === "evm" && asset.isERC20WrappedNativeGasToken) {
  //       return asset;
  //     }
  //   });
  //   if (wrappedNativeAsset) {
  //     console.log(wrappedNativeAsset);
  //   } else {
  //     console.log("not found");
  //     console.log(srcEvmChainConfig.assets);
  //   }
  // }

  if (asset) {
    validateAsset([sourceChain, destinationChain], asset, chainConfigs);
  }

  // chainConfigs.chains
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
