import { AxelarConfigClient, AxelarscanClient, GMPClient } from "@axelarjs/api";
import { DepositAddressClient } from "@axelarjs/api/deposit-address-api/isomorphic";

import {
  triggerGetDepositAddressFromAxelar,
  validateAddress,
  validateChainIds,
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
  validateAddress(params.destinationAddress);
  validateChainIds([params.sourceChain, params.destinationChain]);

  /**
   * invoke API to get deposit address
   */
  const waitForTrigger = await triggerGetDepositAddressFromAxelar(
    params,
    dependencies.depositAddressClient
  );

  return waitForTrigger;

  /**
   * wait for and return deposit address
   */
  // return waitForDepositAddress(params, dependencies.axelarscanClient);
}
