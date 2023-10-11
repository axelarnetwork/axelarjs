import { createAxelarConfigClient } from "@axelarjs/api/axelar-config/";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query/";
import { createGMPClient } from "@axelarjs/api/gmp/";
import { createAxelarSigningClient } from "@axelarjs/cosmos";

import type { AddGasParams } from "../types";
import { addGas as baseAddGas } from "./isomorphic";

export function addGas(params: AddGasParams) {
  const { environment } = params.sendOptions;

  return baseAddGas(params, {
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    getSigningStargateClient: createAxelarSigningClient,
  });
}

export default addGas;
