import { createAxelarscanClient } from "@axelarjs/api";
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp";

import type { EvmAddNativeGasParams } from "../types";
import { addNativeGas as baseAddNativeGas } from "./isomorphic";

export function evmAddNativeGas(params: EvmAddNativeGasParams) {
  const { environment } = params.evmSendOptions;

  return baseAddNativeGas(params, {
    axelarscanClient: createAxelarscanClient(environment),
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  });
}

export default evmAddNativeGas;
