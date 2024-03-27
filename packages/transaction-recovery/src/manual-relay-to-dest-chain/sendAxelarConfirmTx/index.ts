import type {
  AxelarRecoveryApiClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import type { EventResponse } from "../../../../proto/build/module/axelar/evm/v1beta1/query";
import type { ChainConfig } from "../lib/helper";
import { mapSearchGMPToEvmEvent } from "../lib/mapper";
import type { RecoveryTxResponse } from "../types";
import { ConfirmGatewayTxError } from "./error";
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

  const { isFinalized, currentBlockNumber, numRequiredConfirmations } =
    await isFinalizedTx(srcTxBlockNumber, srcChainConfig, axelarQueryRpcClient);

  if (!isFinalized) {
    return {
      skip: true,
      type: "axelar_confirm_gateway_tx",
      error: ConfirmGatewayTxError.NOT_FINALIZED(
        txHash,
        numRequiredConfirmations,
        currentBlockNumber,
        srcTxBlockNumber
      ),
    };
  }

  const eventIndex = searchGMPData.call.eventIndex;
  const srcChain = searchGMPData.call.chain;

  let evmEvent: EventResponse | undefined;

  try {
    evmEvent = await axelarQueryRpcClient.evm.Event({
      chain: srcChain,
      eventId: `${txHash}-${eventIndex}`,
    });
  } catch (e) {
    return {
      skip: true,
      type: "axelar_confirm_gateway_tx",
      error: ConfirmGatewayTxError.FAILED_FETCH_EVM_EVENT,
    };
  }

  // Throw error if the event is not found. This should never happen for valid GMP tx.
  if (!evmEvent.event) {
    return {
      skip: true,
      type: "axelar_confirm_gateway_tx",
      error: ConfirmGatewayTxError.EVM_EVENT_NOT_FOUND,
    };
  }

  // Check if the tx is already confirmed. If so, no need to confirm
  if (isConfirmed(evmEvent.event)) {
    return {
      skip: true,
      type: "axelar_confirm_gateway_tx",
      skipReason: "Already confirmed",
    };
  }

  // TODO: Handle an error here. It's possible to get error. Here's example:
  // Error: Bad status on response: 502
  const confirmTx = await dependencies.axelarRecoveryApiClient.confirm(
    txHash,
    "evm",
    srcChain
  );

  return {
    skip: false,
    type: "axelar_confirm_gateway_tx",
    tx: {
      hash: confirmTx.transactionHash,
    },
  };
}
