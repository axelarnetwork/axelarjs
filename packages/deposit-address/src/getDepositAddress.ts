import { AxelarConfigClient, AxelarscanClient, GMPClient } from "@axelarjs/api";
import type { ChainConfigs } from "@axelarjs/api/axelar-config/types";
import { DepositAddressClient } from "@axelarjs/api/deposit-address-api/isomorphic";

import {
  triggerGetDepositAddressFromAxelar,
  validateAddress,
  validateChainIds,
  waitForDepositAddress,
} from "./helpers";
import { SendOptions } from "./types";

export type GetDepositAddressDependencies = {
  gmpClient: GMPClient;
  depositAddressClient: DepositAddressClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
};

export async function getDepositAddress(
  params: SendOptions,
  dependencies: GetDepositAddressDependencies
) {
  /**
   * input validation
   */
  const chainConfigs = await dependencies.configClient.getChainConfigs(
    params.environment
  );
  console.log({ chainConfigs });
  validateChainIds([params.sourceChain, params.destinationChain], chainConfigs);
  validateAddress(
    params.destinationAddress,
    chainConfigs.chains[params.destinationChain.toLowerCase()] as ChainConfigs
  );

  /**
   * invoke API to get deposit address
   */
  await triggerGetDepositAddressFromAxelar(
    params,
    dependencies.depositAddressClient
  );
  /**
   * wait for and return deposit address
   */
  return waitForDepositAddress(params, dependencies.axelarscanClient);
}
