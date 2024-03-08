import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp";
import { createAxelarSigningClient } from "@axelarjs/cosmos";

import { addGas as baseAddGas } from "./isomorphic";
import type { AddGasParams } from "./types";

export function addGasCosmos(params: AddGasParams) {
  const { environment } = params.sendOptions;

  return baseAddGas(params, {
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    getSigningStargateClient: createAxelarSigningClient,
  });
}

export default addGasCosmos;
