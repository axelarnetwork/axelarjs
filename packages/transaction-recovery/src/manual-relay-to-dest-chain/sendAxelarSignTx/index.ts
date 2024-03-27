import type {
  AxelarRecoveryApiClient,
  AxelarscanClient,
  SearchBatchesResponse,
  SearchGMPResponseData,
} from "@axelarjs/api";

import type { ChainConfig } from "../lib/helper";
import type { RecoveryTxResponse } from "../types";
import { SignCommandsError } from "./error";

export type SendAxelarSignTxParams = {
  searchGMPData: SearchGMPResponseData;
  srcChainConfig: ChainConfig;
};

export type SendAxelarSignTxDependencies = {
  axelarscanClient: AxelarscanClient;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};

export async function sendAxelarSignTx(
  params: SendAxelarSignTxParams,
  deps: SendAxelarSignTxDependencies
): Promise<RecoveryTxResponse> {
  const commandId = params.searchGMPData.command_id;
  const sourceTransactionHash = params.searchGMPData.call.transactionHash;
  const chainId = params.srcChainConfig.id;

  let batchedCommands: SearchBatchesResponse | undefined = undefined;

  try {
    batchedCommands = await deps.axelarscanClient.searchBatchedCommands({
      commandId,
      sourceTransactionHash,
    });
  } catch (e) {
    return {
      skip: true,
      type: "axelar_sign_commands",
      error: SignCommandsError.SEARCH_BATCH_COMMANDS_FAILED,
    };
  }

  // TODO: try to fetch the batched commands from axelar-core as well

  if (batchedCommands?.data.length === 0) {
    // already sent batched tx; no need to sign
    return {
      skip: true,
      type: "axelar_sign_commands",
      skipReason: "No batched commands found",
    };
  }

  const commands = batchedCommands.data[0]!.commands;

  if (commands.length > 0 && commands[0]?.executed) {
    return {
      skip: true,
      type: "axelar_sign_commands",
      error: SignCommandsError.ALREADY_EXECUTED,
    };
  }

  const tx = await deps.axelarRecoveryApiClient.signCommands(chainId, "evm");

  if (tx.code !== 0) {
    return {
      skip: true,
      type: "axelar_sign_commands",
      error: SignCommandsError.SIGN_COMMANDS_FAILED,
    };
  }

  return {
    skip: false,
    type: "axelar_sign_commands",
    tx: {
      hash: tx.transactionHash,
    },
  };
}
