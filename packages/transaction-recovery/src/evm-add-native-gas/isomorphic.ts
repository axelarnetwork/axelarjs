import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  GMPClient,
} from "@axelarjs/api";
// @typescript-eslint/no-unused-vars
import type {
  createPublicClient,
  createPublicTestnetClient,
} from "@axelarjs/evm";

import { EvmAddNativeGasParams } from "src/types";

type EvmClient = ReturnType<
  typeof createPublicTestnetClient | typeof createPublicClient
>;

export type EvmAddNativeGasDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  gmpClient: GMPClient;
  evmClient: EvmClient;
};

// TODO: addNativeGas is not implemented
export async function addNativeGas(
  params: EvmAddNativeGasParams,
  dependencies: EvmAddNativeGasDependencies
) {
  console.log("addNativeGas", params, dependencies);
  await Promise.resolve();
  // 1. get signer from options
  // 2. get tx receipt
  // 3. check if it's already executed
  // 4. get native gas fee
  // 5. call addNativeGas to the gas receiver contract
}
