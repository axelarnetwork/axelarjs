import { memoize } from "@axelarjs/utils";

import { WAGMI_CHAIN_CONFIGS } from "~/config/evm-chains";

/**
 * Returns the native token symbol for a given axelar chain identifier
 *
 * @param axelarChainId axerlar internal chain identifier
 */
export const getNativeToken = memoize((axelarChainId: string) => {
  const chainConfig = WAGMI_CHAIN_CONFIGS.find(
    (chain) => chain.axelarChainId === axelarChainId
  );

  if (!chainConfig) {
    throw new Error(`getNativeToken(): chain ${axelarChainId} does not exist`);
  }

  return chainConfig.nativeCurrency.symbol;
});
