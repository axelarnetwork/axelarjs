import type {
  AxelarRecoveryApiClient,
  AxelarscanClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import { createPublicClient, http } from "viem";

import type { ChainConfig } from "../lib/helper";
import type { RecoveryTxResponse } from "../types";
import { GatewayApproveError } from "./error";

export type SendEvmGatewayApproveTxParams = {
  searchGMPData: SearchGMPResponseData;
  destChainConfig: ChainConfig;
};

export type SendEvmGatewayApproveTxDependencies = {
  axelarQueryRpcClient: AxelarQueryClientService;
  axelarscanClient: AxelarscanClient;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};

export type TransactionRequest = {
  to?: string;
  from?: string;
  nonce?: string;

  gasLimit?: number;
  gasPrice?: bigint;

  data?: string;
  value?: bigint;
  chainId?: number;

  type?: number;
};

export async function sendEvmGatewayApproveTx(
  params: SendEvmGatewayApproveTxParams,
  deps: SendEvmGatewayApproveTxDependencies
): Promise<RecoveryTxResponse> {
  const { destChainConfig, searchGMPData } = params;
  const { axelarRecoveryApiClient, axelarscanClient, axelarQueryRpcClient } =
    deps;

  const { address } = await axelarQueryRpcClient.evm.GatewayAddress({
    chain: destChainConfig.id,
  });

  const gatewayAddress = address as `0x${string}`;
  const destChain = searchGMPData.call.returnValues.destinationChain;
  const sourceTransactionHash = params.searchGMPData.call.transactionHash;
  const rpcUrl = params.destChainConfig.rpcUrl;
  const commandId = searchGMPData.command_id;

  if (!rpcUrl) {
    return {
      skip: true,
      type: "evm_gateway_approve",
      error: GatewayApproveError.RPC_NOT_FOUND(destChain),
    };
  }

  const batchResponse = await axelarscanClient.searchBatchedCommands({
    commandId,
    sourceTransactionHash,
  });

  const executeData = batchResponse.data[0]?.execute_data;

  if (!executeData) {
    return {
      skip: true,
      type: "evm_gateway_approve",
      skipReason: "cannot find executeData from batch response",
    };
  }

  const signEvmTxResponse = await axelarRecoveryApiClient.signEvmTx(
    destChain,
    gatewayAddress,
    executeData
  );

  const signedEvmTx = signEvmTxResponse as `0x${string}`;

  const publicClient = createPublicClient({
    transport: http(rpcUrl),
  });

  const transactionHash = await publicClient.sendRawTransaction({
    serializedTransaction: signedEvmTx,
  });

  return {
    skip: false,
    type: "evm_gateway_approve",
    tx: {
      hash: transactionHash,
    },
  };
}
