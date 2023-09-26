import { createAxelarConfigClient } from "@axelarjs/api/axelar-config/";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query/";
import { createGMPClient } from "@axelarjs/api/gmp/";
import { AxelarSigningStargateClient } from "@axelarjs/cosmos";

import type { AddGasParams } from "../types";
import { addGas as baseAddGas } from "./isomorphic";

export function addGas(params: AddGasParams) {
  const { environment } = params.sendOptions;

  return baseAddGas(params, {
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    getSigningStargateClient:
      AxelarSigningStargateClient.connectWithSigner.bind(
        AxelarSigningStargateClient
      ),
  });
}

export default addGas;
