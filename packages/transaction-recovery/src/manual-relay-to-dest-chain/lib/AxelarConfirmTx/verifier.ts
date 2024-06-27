import { createPublicClient, http } from "viem";

import {
  Event_Status,
  type Event,
} from "../../../../../proto/build/module/axelar/evm/v1beta1/types";
import type { ChainConfig } from "../../types";

export function isConfirmed(evmEvent: Event) {
  return (
    evmEvent.status === Event_Status.STATUS_COMPLETED ||
    evmEvent.status === Event_Status.STATUS_CONFIRMED
  );
}

export async function isBlockFinalized(
  blockNumber: bigint,
  config: ChainConfig
) {
  const publicClient = createPublicClient({
    transport: http(config.rpcUrl),
  });

  const latestFinalizedBlock = await publicClient.getBlock({
    blockTag: "finalized",
  });

  return latestFinalizedBlock.number >= blockNumber;
}
