import {
  AxelarRecoveryApiClient,
  type SearchGMPResponseData,
} from "@axelarjs/api";

import type { RecoveryTxResponse } from "../../types";

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
      type: "axelar.route_message",
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
      type: "axelar.route_message",
      tx: {
        transactionHash: tx.transactionHash,
      },
    };
  } catch (e) {
    return {
      skip: true,
      type: "axelar.route_message",
      skipReason: "Failed to send route message tx",
    };
  }
}
