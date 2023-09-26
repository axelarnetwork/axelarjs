import type { ChainConfigs } from "@axelarjs/api/axelar-config/types";

import {
  getDepositAddressFromAxelarNetwork,
  validateAddress,
  validateAsset,
  validateChainIds,
} from "./helpers";
import type { GetDepositAddressDependencies, SendOptions } from "./types";

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
    chainConfigs.chains[params.destinationChain.toLowerCase()] as ChainConfigs
  );

  return getDepositAddressFromAxelarNetwork(params, chainConfigs, dependencies);
}
