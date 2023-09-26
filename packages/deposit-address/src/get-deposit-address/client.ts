import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarscanClient } from "@axelarjs/api/axelarscan";
import { createDepositAddressApiClient } from "@axelarjs/api/deposit-address";
import { createGMPClient } from "@axelarjs/api/gmp";

import { getDepositAddress as baseGetDepositAddress } from "./isomorphic";
import type { SendOptions } from "./types";

export function getDepositAddress(params: SendOptions) {
  const { environment } = params;

  return baseGetDepositAddress(params, {
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    depositAddressClient: createDepositAddressApiClient(environment),
    axelarscanClient: createAxelarscanClient(environment),
  });
}

export default getDepositAddress;
