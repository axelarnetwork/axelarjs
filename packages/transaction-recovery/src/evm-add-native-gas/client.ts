import { createAxelarscanClient } from "@axelarjs/api";
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp";

import type { EvmAddNativeGasParams } from "../types";
import { addNativeGas as baseAddNativeGas } from "./isomorphic";

/**
 * Send additional native gas to the source transaction to cover the insufficient gas fee.
 * This function will calculate the amount that needs to be paid additionally and send the transaction to pay the native gas to the AxelarGasService contract.
 * @param params - The parameters to send additional native gas. the parameters are:
 * - `txHash`: The hash of the source transaction.
 * - `chain`: The source chain of the transaction.
 * - `estimatedGasUsed`: The estimated gas used to execute transaction on the destination chain.
 * - `evmSendOptions`: The options to send the transaction.
 * @returns The native gas payment transaction.
 */
export function evmAddNativeGas(params: EvmAddNativeGasParams) {
  const { environment } = params;

  return baseAddNativeGas(params, {
    axelarscanClient: createAxelarscanClient(environment),
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  });
}

export default evmAddNativeGas;
