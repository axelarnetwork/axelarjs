import type {
  AxelarRecoveryApiClient,
  AxelarscanClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import { createPublicClient, http } from "viem";

import type { ChainConfig } from "../lib/helper";
import type { RecoveryTxResponse } from "../types";

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
  const { axelarRecoveryApiClient, axelarscanClient, axelarQueryRpcClient } =
    deps;

  const { address } = await axelarQueryRpcClient.evm.GatewayAddress({
    chain: params.destChainConfig.id,
  });

  const gatewayAddress = address as `0x${string}`;
  const destChain = params.searchGMPData.call.returnValues.destinationChain;

  const commandId = params.searchGMPData.command_id;

  const batchResponse = await axelarscanClient.searchBatchedCommands({
    commandId,
    sourceTransactionHash: params.searchGMPData.call.transactionHash,
  });

  const executeData = batchResponse.data[0]?.execute_data;

  if (!executeData) {
    return {
      skip: true,
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
    transport: http(params.destChainConfig.rpcUrl),
  });

  const transactionHash = await publicClient.sendRawTransaction({
    serializedTransaction: signedEvmTx,
  });

  return {
    skip: false,
    tx: {
      hash: transactionHash,
      type: "evm_gateway_approve",
    },
  };
}
