import {
  createAxelarQueryBrowserClient,
  createConfigBrowserClient,
  createGMPBrowserClient,
} from "@axelarjs/api";

import { SigningStargateClient } from "@cosmjs/stargate";

import { AddGasParams } from "~/types";
import { addGas } from "./addGas";

export default function addGasBrowser(params: AddGasParams) {
  const { environment } = params.sendOptions;

  return addGas(params, {
    axelarQueryClient: createAxelarQueryBrowserClient(environment, {}),
    configClient: createConfigBrowserClient(environment),
    gmpClient: createGMPBrowserClient(environment),
    getSigningStargateClient: SigningStargateClient.connectWithSigner,
  });
}
