import { createAxelarConfigBrowserClient } from "@axelarjs/api/axelar-config/browser";
import { createAxelarscanBrowserClient } from "@axelarjs/api/axelarscan/browser";
import { createDepositAddressApiBrowserClient } from "@axelarjs/api/deposit-address/browser";
import { createGMPBrowserClient } from "@axelarjs/api/gmp/browser";

import { getDepositAddress } from "./isomorphic";
import type { SendOptions } from "./types";

export function getDepositAddressBrowser(params: SendOptions) {
  const { environment } = params;

  return getDepositAddress(params, {
    configClient: createAxelarConfigBrowserClient(environment),
    gmpClient: createGMPBrowserClient(environment),
    depositAddressClient: createDepositAddressApiBrowserClient(environment),
    axelarscanClient: createAxelarscanBrowserClient(environment),
  });
}

export default getDepositAddressBrowser;
