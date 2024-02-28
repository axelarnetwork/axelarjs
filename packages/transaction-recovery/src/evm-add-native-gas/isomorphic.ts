import type {
  AxelarConfigClient,
  AxelarEVMChainConfig,
  AxelarQueryAPIClient,
  AxelarscanClient,
  ChainConfig,
  GMPClient,
} from "@axelarjs/api";

import { createPublicClient, getContract, http, parseAbi } from "viem";

import { EvmAddNativeGasParams } from "../types";
import {
  getDestinationChainFromTxReceipt,
  getGasServiceAddressFromChainConfig,
  getLogIndexFromTxReceipt,
  getNativeGasPaidForContractCallEvent,
  getNativeGasPaidForContractCallWithTokenEvent,
} from "./helper";

export type EvmAddNativeGasDependencies = {
  axelarQueryClient: AxelarQueryAPIClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
  gmpClient: GMPClient;
};

// async function calculateNativeGasFee(
//   txHash: Hash,
//   sourceChain: string,
//   destinationChain: string,
//   estimatedGasUsed: number,
//   dependencies: EvmAddNativeGasDependencies,
//   options: QueryGasFeeOptions
// ): Promise<string> {
//   // await throwIfInvalidChainIds(
//   //   [sourceChain, destinationChain],
//   //   this.environment
//   // );
//   // console.log("addNativeGas", params, dependencies);
//   // const { evmClient, axelarscanClient } = dependencies;
//   // // const chainConfigs = await axelarscanClient.getChainConfigs();
//   // const receipt = await evmClient.getTransactionReceipt({
//   //   hash: txHash,
//   // });
// }

// TODO: addNativeGas is not implemented
export async function addNativeGas(
  params: EvmAddNativeGasParams,
  dependencies: EvmAddNativeGasDependencies
) {
  // const { chain, txHash, evmSendOptions, estimatedGasUsed } = params;
  const { axelarscanClient, configClient } = dependencies;
  const { evmSendOptions } = params;

  // 1. Find config for the chain with rpc url
  const chainConfigs = await axelarscanClient.getChainConfigs();
  const evmChainConfigs = chainConfigs.evm;
  const chainConfig = evmChainConfigs.find(
    (config) => config.id.toLowerCase() === params.chain.toLowerCase()
  );

  if (!chainConfig) {
    // TODO: Should also allow for custom rpc urls
    throw new Error(`RPC not found for ${params.chain}`);
  }

  const client = createPublicClient({
    transport: http(chainConfig.endpoints.rpc[0]),
  });

  const receipt = await client.getTransactionReceipt({
    hash: params.txHash,
  });

  const destChain = getDestinationChainFromTxReceipt(receipt);
  const logIndex = getLogIndexFromTxReceipt(receipt);

  if (!destChain) {
    throw new Error("Invalid GMP Tx");
  }

  const gasServiceAddress = await getGasServiceAddressFromChainConfig(
    configClient,
    evmSendOptions.environment,
    destChain
  );

  console.log(gasServiceAddress);

  // const contract = getContract({
  //   abi: parseAbi([
  //     "function addNativeGas(bytes32 txHash,uint256 logIndex,address refundAddress) external payable",
  //   ]),
  //   address: gasServiceAddress,
  //   client,
  // });

  // const contract = new ethers.Contract(
  //   gasReceiverAddress,
  //   [
  //     "function addNativeGas(bytes32 txHash,uint256 logIndex,address refundAddress) external payable",
  //   ],
  //   signer
  // );
  // return contract
  //   .addNativeGas(txHash, logIndex, refundAddress, {
  //     value: gasFeeToAdd,
  //   })

  // const logs = getNativeGasPaidForContractCallWithTokenEvent(receipt);

  // 1. get tx receipt
  // 2. check if it's already executed
  // 3. get native gas fee
  // 4. get signer from options
  // 5. call addNativeGas to the gas receiver contract

  await Promise.resolve();
}
