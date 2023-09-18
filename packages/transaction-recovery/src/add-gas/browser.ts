import { createAxelarConfigBrowserClient } from "@axelarjs/api/axelar-config/browser";
import { createAxelarQueryBrowserClient } from "@axelarjs/api/axelar-query/browser";
import { createGMPBrowserClient } from "@axelarjs/api/gmp/browser";

import { SigningStargateClient } from "@cosmjs/stargate";

import { AddGasParams } from "~/types";
import { addGas } from "./addGas";

export default function addGasBrowser(params: AddGasParams) {
  const { environment } = params.sendOptions;

  return addGas(params, {
    axelarQueryClient: createAxelarQueryBrowserClient(environment, {}),
    configClient: createAxelarConfigBrowserClient(environment),
    gmpClient: createGMPBrowserClient(environment),
    getSigningStargateClient: SigningStargateClient.connectWithSigner,
  });
}
