import {
  AxelarRecoveryApiClient,
  type SearchGMPResponseData,
} from "@axelarjs/api";

import type { RecoveryTxResponse } from "../types";

export type SendAxelarRouteMessageTxParams = {
  searchGMPData: SearchGMPResponseData;
};

export type SendAxelarRouteMessageTxDependencies = {
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};

export async function sendAxelarRouteMessageTx(
  params: SendAxelarRouteMessageTxParams,
  deps: SendAxelarRouteMessageTxDependencies
): Promise<RecoveryTxResponse> {
  const payload = params.searchGMPData.call.returnValues.payload;
  const messageId = params.searchGMPData.call.returnValues.messageId;

  if (!messageId) {
    return {
      skip: true,
      skipReason: "No messageId found",
    };
  }

  try {
    const tx = await deps.axelarRecoveryApiClient.routeMessage(
      payload,
      messageId
    );

    return {
      skip: false,
      tx: {
        hash: tx.transactionHash,
        type: "axelar_route_message",
      },
    };
  } catch (e) {
    return {
      skip: true,
      skipReason: "Failed to send route message tx",
    };
  }
}
