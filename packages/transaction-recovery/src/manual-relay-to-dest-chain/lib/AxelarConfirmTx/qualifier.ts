import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import { createPublicClient, http } from "viem";

import {
  Event_Status,
  type Event,
} from "../../../../../proto/build/module/axelar/evm/v1beta1/types";
import type { ChainConfig } from "../helper";

export function isConfirmed(evmEvent: Event) {
  return (
    evmEvent.status === Event_Status.STATUS_COMPLETED ||
    evmEvent.status === Event_Status.STATUS_CONFIRMED
  );
}

export async function isFinalizedTx(
  srcTxBlockNumber: bigint,
  srcChainConfig: ChainConfig,
  axelarQueryClientService: AxelarQueryClientService
) {
  const confirmHeightResponse =
    await axelarQueryClientService.evm.ConfirmationHeight({
      chain: srcChainConfig.id,
    });

  const numRequiredConfirmations = BigInt(confirmHeightResponse.height.toInt());

  // Check if the tx has enough confirmations
  const publicClient = createPublicClient({
    transport: http(srcChainConfig.rpcUrl),
  });

  const currentBlockNumber = await publicClient.getBlockNumber();

  return {
    isFinalized:
      currentBlockNumber - srcTxBlockNumber >= numRequiredConfirmations,
    numRequiredConfirmations,
    currentBlockNumber,
  };
}
