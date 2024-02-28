import type {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  AxelarscanClient,
  GMPClient,
} from "@axelarjs/api";
// @typescript-eslint/no-unused-vars
import type {
  createPublicClient,
  createPublicTestnetClient,
} from "@axelarjs/evm";

import {
  decodeEventLog,
  parseAbi,
  toFunctionSelector,
  type Abi,
  type DecodeEventLogParameters,
  type DecodeEventLogReturnType,
  type Hash,
  type TransactionReceipt,
} from "viem";

import {
  EvmAddNativeGasParams,
  type EvmClient,
  type QueryGasFeeOptions,
} from "../types";

export type EvmAddNativeGasDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
  gmpClient: GMPClient;
  evmClient: EvmClient;
};

async function calculateNativeGasFee(
  txHash: Hash,
  sourceChain: string,
  destinationChain: string,
  estimatedGasUsed: number,
  dependencies: EvmAddNativeGasDependencies,
  options: QueryGasFeeOptions
): Promise<string> {
  // await throwIfInvalidChainIds(
  //   [sourceChain, destinationChain],
  //   this.environment
  // );

  // console.log("addNativeGas", params, dependencies);
  const { evmClient, axelarscanClient } = dependencies;
  // const chainConfigs = await axelarscanClient.getChainConfigs();
  const receipt = await evmClient.getTransactionReceipt({
    hash: txHash,
  });
}

// TODO: addNativeGas is not implemented
export async function addNativeGas(
  params: EvmAddNativeGasParams,
  dependencies: EvmAddNativeGasDependencies
) {
  console.log("addNativeGas", params, dependencies);
  const { evmClient, axelarscanClient } = dependencies;
  const chainConfigs = await axelarscanClient.getChainConfigs();
  chainConfigs.evm;

  // await Promise.resolve();
  // const signer =
  // 1. get signer from options
  // 2. get tx receipt
  // 3. check if it's already executed
  // 4. get native gas fee
  // 5. call addNativeGas to the gas receiver contract

  await Promise.resolve();
}
