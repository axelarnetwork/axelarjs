import { memoize } from "@axelarjs/utils";

import { WAGMI_CHAIN_CONFIGS } from "~/config/evm-chains";

export const NATIVE_TOKEN_OVERRIDE: Record<string, string> = {
  // ethereum-sepolia actual symbol is SEP under the wagmi chain config
  "ethereum-sepolia": "ETH",
};

/**
 * Returns the native token symbol for a given axelar chain identifier
 *
 * @param axelarChainId axerlar internal chain identifier
 */
export const getNativeToken = memoize((axelarChainId: string) => {
  // If we have an override, we use that
  if (axelarChainId in NATIVE_TOKEN_OVERRIDE) {
    return NATIVE_TOKEN_OVERRIDE[axelarChainId];
  }

  const chainConfig = WAGMI_CHAIN_CONFIGS.find(
    (chain) =>
      chain.axelarChainId?.toLowerCase() === axelarChainId?.toLowerCase()
  );

  if (!chainConfig) {
    throw new Error(`getNativeToken(): chain ${axelarChainId} does not exist`);
  }

  return chainConfig.nativeCurrency.symbol;
});
