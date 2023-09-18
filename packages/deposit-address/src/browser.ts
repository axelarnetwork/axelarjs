import { createAxelarscanBrowserClient } from "@axelarjs/api";
import { createAxelarConfigBrowserClient } from "@axelarjs/api/axelar-config/browser";
import { createDepositAddressApiBrowserClient } from "@axelarjs/api/deposit-address-api/browser";
import { createGMPBrowserClient } from "@axelarjs/api/gmp/browser";

import { getDepositAddress } from "./getDepositAddress";
import { SendOptions } from "./types";

export default function getDepositAddressBrowser(params: SendOptions) {
  const { environment } = params;

  return getDepositAddress(params, {
    configClient: createAxelarConfigBrowserClient(environment),
    gmpClient: createGMPBrowserClient(environment),
    depositAddressClient: createDepositAddressApiBrowserClient({
      prefixUrl: "https://nest-server-testnet.axelar.dev", //TODO, hard-coded for now
    }),
    axelarscanClient: createAxelarscanBrowserClient(environment),
  });
}
