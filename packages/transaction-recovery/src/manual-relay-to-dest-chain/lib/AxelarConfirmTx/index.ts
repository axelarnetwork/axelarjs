import type {
  AxelarRecoveryApiClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import type { EventResponse } from "../../../../../proto/build/module/axelar/evm/v1beta1/query";
import type { ChainConfig, RecoveryTxResponse } from "../../types";
import { ConfirmGatewayTxError } from "./error";
import { isBlockFinalized, isConfirmed } from "./qualifier";

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

  const finalized = await isBlockFinalized(srcTxBlockNumber, srcChainConfig);

  if (!finalized) {
    return {
      skip: true,
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.NOT_FINALIZED(txHash).message,
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
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.FAILED_FETCH_EVM_EVENT.message,
    };
  }

  // Throw error if the event is not found. This should never happen for valid GMP tx.
  if (!evmEvent.event) {
    return {
      skip: true,
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.EVM_EVENT_NOT_FOUND.message,
    };
  }

  // Check if the tx is already confirmed. If so, no need to confirm
  if (isConfirmed(evmEvent.event)) {
    return {
      skip: true,
      type: "axelar.confirm_gateway_tx",
      skipReason: "Already confirmed",
    };
  }

  try {
    const confirmTx = await dependencies.axelarRecoveryApiClient.confirm(
      txHash,
      "evm",
      srcChain
    );

    if (confirmTx.code !== 0) {
      return {
        skip: true,
        type: "axelar.confirm_gateway_tx",
        error: ConfirmGatewayTxError.FAILED_TO_CONFIRM("").message,
      };
    }

    return {
      skip: false,
      type: "axelar.confirm_gateway_tx",
      tx: {
        transactionHash: confirmTx.transactionHash,
      },
    };
  } catch (e) {
    const error = e as Error;
    return {
      skip: true,
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.FAILED_TO_CONFIRM(error.message).message,
    };
  }
}