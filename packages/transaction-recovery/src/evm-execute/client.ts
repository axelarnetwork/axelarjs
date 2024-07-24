import { createAxelarscanClient } from "@axelarjs/api";
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp";

import { evmExecute as baseEvmExecute } from "./isomorphic";
import type { EvmExecuteParams } from "./types";

/**
 * A wrapper function for executing EVM transaction on the destination chain.
 *
 * @param params - An object containing parameters for the EVM execution, including the environment.
 * @returns The result of the EVM execution.
 */
export function evmExecute(params: EvmExecuteParams) {
  const { environment } = params;

  return baseEvmExecute(params, {
    axelarscanClient: createAxelarscanClient(environment),
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  });
}

export default evmExecute;
