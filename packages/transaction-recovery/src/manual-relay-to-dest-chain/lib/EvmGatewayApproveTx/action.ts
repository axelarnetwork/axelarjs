import type { RecoveryTxResponse } from "../../types";
import { retry } from "../helper";
import { GatewayApproveError } from "./error";
import { executeApproveTx } from "./txHelper";
import type {
  SendEvmGatewayApproveTxDependencies,
  SendEvmGatewayApproveTxParams,
} from "./types";

export async function sendEvmGatewayApproveTx(
  params: SendEvmGatewayApproveTxParams,
  deps: SendEvmGatewayApproveTxDependencies
): Promise<RecoveryTxResponse> {
  const { destChainConfig, searchGMPData } = params;
  const { axelarscanClient, axelarQueryRpcClient } = deps;

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
      type: "evm.gateway_approve",
      error: GatewayApproveError.RPC_NOT_FOUND(destChain).message,
    };
  }

  const batchResponse = await retry(async () => {
    const batchedCommands = await axelarscanClient.searchBatchedCommands({
      commandId,
      sourceTransactionHash,
    });

    if (batchedCommands.data.length === 0) {
      throw new Error("batched commands not found. retrying...");
    }

    return batchedCommands;
  });

  const executeData = batchResponse.data[0]?.execute_data;

  if (!executeData) {
    return {
      skip: true,
      type: "evm.gateway_approve",
      error: GatewayApproveError.EXECUTE_DATA_NOT_FOUND.message,
    };
  }

  try {
    const transactionHash = await executeApproveTx(
      rpcUrl,
      executeData,
      gatewayAddress
    );

    return {
      skip: false,
      type: "evm.gateway_approve",
      tx: {
        transactionHash: transactionHash,
      },
    };
  } catch (e) {
    const error = e as Error;
    return {
      skip: true,
      type: "evm.gateway_approve",
      error: GatewayApproveError.FAILED_TX(error).message,
    };
  }
}
