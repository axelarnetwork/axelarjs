import { memoize } from "@axelarjs/utils";

import { WAGMI_CHAIN_CONFIGS } from "~/config/evm-chains";

/**
 * Overrides for native tokens that have a symbol mismatch with the gas estimation API
 */
export const NATIVE_TOKEN_OVERRIDES: Record<string, string> = {
  "ethereum-sepolia": "ETH",
  "filecoin-2": "FIL",
  celo: "CELO",
  binance: "BNB",
};

/**
 * Returns the native token symbol for a given axelar chain identifier
 *
 * @param axelarChainId axerlar internal chain identifier
 */
export const getNativeToken = memoize((axelarChainId: string) => {
  // If we have an override, we use that
  if (axelarChainId in NATIVE_TOKEN_OVERRIDES) {
    return NATIVE_TOKEN_OVERRIDES[axelarChainId];
  }

  const chainConfig = WAGMI_CHAIN_CONFIGS.find(
    (chain) =>
      chain.axelarChainId.toLowerCase() === axelarChainId.toLowerCase(),
  );

  if (!chainConfig) {
    throw new Error(`getNativeToken(): chain ${axelarChainId} does not exist`);
  }

  return chainConfig.nativeCurrency.symbol;
});
