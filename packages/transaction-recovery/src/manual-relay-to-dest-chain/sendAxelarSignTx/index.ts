import type {
  AxelarRecoveryApiClient,
  AxelarscanClient,
  SearchBatchesResponse,
} from "@axelarjs/api";

import type { RecoveryTxResponse } from "../types";

export type SendAxelarSignTxParams = {
  commandId?: string | undefined;
  sourceTransactionHash?: `0x${string}` | undefined;
  chainId: string;
};

export type SendAxelarSignTxDependencies = {
  axelarscanClient: AxelarscanClient;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};

export async function sendAxelarSignTx(
  params: SendAxelarSignTxParams,
  deps: SendAxelarSignTxDependencies
): Promise<RecoveryTxResponse> {
  const { commandId, chainId, sourceTransactionHash } = params;

  let batchedCommands: SearchBatchesResponse | undefined;

  try {
    batchedCommands = await deps.axelarscanClient.searchBatchedCommands({
      commandId,
      sourceTransactionHash,
    });
  } catch (e) {
    return {
      skip: true,
      error: new Error(`Failed to search batched commands`),
    };
  }

  // TODO: try to fetch the batched commands from axelar-core as well

  if (batchedCommands?.data.length === 0) {
    // already sent batched tx; no need to sign
    return {
      skip: true,
      skipReason: "No batched commands found",
    };
  }

  const commands = batchedCommands.data[0]!.commands;

  if (commands.length > 0 && commands[0]?.executed) {
    return {
      skip: true,
      error: new Error("Already executed approved batched tx"),
    };
  }

  const tx = await deps.axelarRecoveryApiClient.signCommands(chainId, "evm");

  if (tx.code !== 0) {
    return {
      skip: true,
      error: new Error(`Failed to sign commands: ${tx.rawLog}`),
    };
  }

  return {
    skip: false,
    tx: {
      hash: tx.transactionHash,
      type: "axelar_sign_commands",
    },
  };
}
