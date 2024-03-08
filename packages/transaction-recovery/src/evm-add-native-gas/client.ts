import { createAxelarscanClient } from "@axelarjs/api";
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp";

import { addNativeGas as baseAddNativeGas } from "./isomorphic";
import type { EvmAddNativeGasParams } from "./types";

/**
 * Send additional native gas to the source transaction to cover the insufficient gas fee.
 * This function will calculate the amount that needs to be paid additionally and send the transaction to pay the native gas to the AxelarGasService contract.
 * The default sender wallet is browser-based wallet (window.ethereum), but it can be overridden by providing the private key.
 * @param params - The parameters to send additional native gas. the parameters are:
 * - `txHash`: The hash of the source transaction.
 * - `chain`: The source chain of the transaction.
 * - `estimatedGasUsed`: The estimated gas used to execute transaction on the destination chain.
 * - `addNativeGasOptions` (Optional): The options to send the transaction. The options are:
 *  - `amount` (Optional): The amount of native gas to be paid. If not provided, the amount will be calculated based on the estimated gas used and the gas multiplier.
 *  - `gasMultiplier` (Optional): The multiplier to calculate the amount of native gas to be paid. If not provided, the api will use the pre-calculated value.
 *  - `privateKey` (Optional): The private key of the sender. If not provided, the api will use the connected sender on browser-based wallet.
 *  - `refundAddress` (Optional): The address to refund the native gas if there's any remaining after execution. If not provided, the api will use the sender address.
 *  - `rpcUrl` (Optional): The RPC URL of the source chain. if not provided, the api will use the RPC URL from the chain configuration.
 * @returns The native gas payment transaction.
 */
export function addNativeGasEvm(params: EvmAddNativeGasParams) {
  const { environment } = params;

  return baseAddNativeGas(params, {
    axelarscanClient: createAxelarscanClient(environment),
    axelarQueryClient: createAxelarQueryClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  });
}

export default addNativeGasEvm;
