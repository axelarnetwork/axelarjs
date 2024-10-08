import type { SendAxelarSignTxDependencies, SendAxelarSignTxParams } from ".";
import type { RecoveryTxResponse } from "../../types";
import { retry } from "../helper";
import { SignCommandsError, SignCommandsSkipReason } from "./constants";

export async function sendAxelarSignTx(
  params: SendAxelarSignTxParams,
  deps: SendAxelarSignTxDependencies
): Promise<RecoveryTxResponse> {
  const commandId = params.searchGMPData.command_id;
  const sourceTransactionHash = params.searchGMPData.call.transactionHash;
  const chainId = params.srcChainConfig.id;

  try {
    // Trying to find batched commands first, if found, skip signing
    const batchedCommands = await retry(async () => {
      const response = await deps.axelarscanClient.searchBatchedCommands({
        commandId,
        sourceTransactionHash,
      });

      return response;
    }).catch(() => {
      return {
        data: [],
      };
    });

    // batch commands already signed
    if (batchedCommands?.data.length > 0) {
      return {
        skip: true,
        type: "axelar.sign_commands",
        skipReason: SignCommandsSkipReason.ALREADY_EXECUTED,
      };
    }

    const tx = await deps.axelarRecoveryApiClient.signCommands(chainId, "evm");

    if (tx.code !== 0) {
      return {
        skip: true,
        type: "axelar.sign_commands",
        error: SignCommandsError.SIGN_COMMANDS_FAILED.message,
      };
    }

    return {
      skip: false,
      type: "axelar.sign_commands",
      tx: {
        transactionHash: tx.transactionHash,
      },
    };
  } catch (e) {
    return {
      skip: true,
      type: "axelar.sign_commands",
      error: SignCommandsError.SIGN_COMMANDS_FAILED.message,
    };
  }
}
