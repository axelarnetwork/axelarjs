import type {
  AxelarRecoveryApiClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import type { ChainConfig } from "../lib/helper";
import { mapSearchGMPToEvmEvent } from "../lib/mapper";
import type { RecoveryTxResponse } from "../types";
import { isConfirmed, isFinalizedTx } from "./qualifier";

export type SendAxelarConfirmTxParams = {
  srcChainConfig: ChainConfig;
  searchGMPData: SearchGMPResponseData;
};

export type SendAxelarConfirmTxDependencies = {
  axelarQueryRpcClient: AxelarQueryClientService;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};

export async function sendAxelarConfirmTx(
  params: SendAxelarConfirmTxParams,
  dependencies: SendAxelarConfirmTxDependencies
): Promise<RecoveryTxResponse> {
  const { searchGMPData, srcChainConfig } = params;
  const { axelarQueryRpcClient } = dependencies;

  const txHash = searchGMPData.call.transactionHash;
  const srcTxBlockNumber = BigInt(searchGMPData.call.blockNumber);

  const { eventIndex, srcChain } = mapSearchGMPToEvmEvent(searchGMPData);

  const evmEvent = await axelarQueryRpcClient.evm.Event({
    chain: srcChain,
    eventId: `${txHash}-${eventIndex}`,
  });

  // Throw error if the event is not found. This should never happen for valid GMP tx.
  if (!evmEvent.event) {
    return {
      skip: true,
      error: new Error("EVM event not found"),
    };
  }

  // Check if the tx is already confirmed. If so, no need to confirm
  if (isConfirmed(evmEvent.event)) {
    return {
      skip: true,
    };
  }

  const { isFinalized, currentBlockNumber, numRequiredConfirmations } =
    await isFinalizedTx(srcTxBlockNumber, srcChainConfig, axelarQueryRpcClient);

  if (isFinalized) {
    return {
      skip: true,
      error: new Error(
        `Not enough confirmations for tx ${txHash}. Required ${numRequiredConfirmations}, got ${
          currentBlockNumber - srcTxBlockNumber
        }`
      ),
    };
  }

  const confirmTx = await dependencies.axelarRecoveryApiClient.confirm(
    txHash,
    "evm",
    srcChain
  );

  return {
    skip: false,
    tx: {
      hash: confirmTx.transactionHash,
      type: "axelar_confirm_gateway_tx",
    },
  };
}
