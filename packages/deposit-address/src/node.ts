import { createAxelarConfigNodeClient } from "@axelarjs/api/axelar-config/node";
import { createAxelarscanNodeClient } from "@axelarjs/api/axelarscan/node";
import { createDepositAddressApiNodeClient } from "@axelarjs/api/deposit-address/node";
import { createGMPNodeClient } from "@axelarjs/api/gmp/node";

import { getDepositAddress } from "./isomorphicDepositAddress";
import type { SendOptions } from "./types";

export function getDepositAddressNode(params: SendOptions) {
  const { environment } = params;

  return getDepositAddress(params, {
    configClient: createAxelarConfigNodeClient(environment),
    gmpClient: createGMPNodeClient(environment),
    depositAddressClient: createDepositAddressApiNodeClient(environment),
    axelarscanClient: createAxelarscanNodeClient(environment),
  });
}

export default getDepositAddressNode;
