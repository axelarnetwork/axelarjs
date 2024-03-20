import {
  getDepositAddressFromAxelarNetwork,
  unwrappable,
  validateAddressAndChains,
  validateAsset,
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

/**
 * Get the deposit address for a given asset, where:
 * - if the asset is "native", this function will return deposit address for the native token
 * - if the asset is not "native" (e.g. "uusdc"), this function will return the linked deposit address for the asset
 * - if the asset is not "native" (e.g. "uusdc") and unwrappable at the destination chain, this function will return the linked deposit address
 * where the asset is unwrapped first at the destination chain before sending to the destination address.
 * Note: You can skip the unwrap step by setting the `skipUnwrap` option to true.
 * @param params
 * @param dependencies
 * @returns
 */
export async function getDepositAddress(
  params: DepositAddressOptions,
  dependencies: GetDepositAddressDependencies,
) {
  const {
    asset,
    sourceChain,
    destinationChain,
    environment,
    destinationAddress,
    requestConfig,
  } = params;

  const chainConfigs = await dependencies.configClient.getAxelarConfigs(
    params.environment,
  );

  // we consider undefined asset as a native token asset
  if (asset === "native") {
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
      dependencies,
    );
  } else {
    // this is an erc20 token, we need to check if it is unwrappable at the destination chain
    const shouldUnwrapToken = unwrappable(
      destinationChain,
      asset,
      chainConfigs,
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
          requestConfig,
        },
        dependencies,
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
        dependencies,
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
  dependencies: GetLinkedDepositAddressDependencies,
) {
  const chainConfigs = await dependencies.configClient.getAxelarConfigs(
    params.environment,
  );

  /**
   * input validation
   */

  validateAsset(
    [params.sourceChain, params.destinationChain],
    params.asset,
    chainConfigs,
  );
  await validateAddressAndChains(
    params.sourceChain,
    params.destinationChain,
    params.destinationAddress,
    chainConfigs,
    params.environment,
    params.requestConfig,
  );

  return getDepositAddressFromAxelarNetwork(params, chainConfigs, dependencies);
}

export async function getNativeWrapDepositAddress(
  params: DepositNativeWrapOptions,
  dependencies: GetDepositServiceDependencies,
) {
  const chainConfigs = await dependencies.configClient.getAxelarConfigs(
    params.environment,
  );

  await validateAddressAndChains(
    params.sourceChain,
    params.destinationChain,
    params.destinationAddress,
    chainConfigs,
    params.environment,
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
  dependencies: GetDepositServiceDependencies,
) {
  const chainConfigs = await dependencies.configClient.getAxelarConfigs(
    params.environment,
  );

  await validateAddressAndChains(
    params.sourceChain,
    params.destinationChain,
    params.destinationAddress,
    chainConfigs,
    params.environment,
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
