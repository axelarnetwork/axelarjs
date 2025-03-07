import { GMPTxStatus } from "@axelarjs/api";

import { Context } from "vm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { suiClient } from "~/lib/clients/suiClient";
import { publicProcedure } from "~/server/trpc";
import MaestroKVClient from "~/services/db/kv";
import { getSuiEventsByTxHash } from "../sui/utils/utils";

export type ChainStatus = {
  status: GMPTxStatus;
  txHash: string;
  txId: string;
  lastHop: boolean;
  logIndex: number;
};

export const SEARCHGMP_SOURCE = {
  includes: [
    "call",
    "status",
    "approved",
    "confirm",
    "executed",
    "callback",
    "interchain_token_deployment_started",
  ],
  excludes: [
    "call.transaction",
    "fees",
    "gas",
    "gas_price_rate",
    "gas_paid",
    ...["approved", "confirm", "executed"].flatMap((prefix) => [
      `${prefix}.receipt`,
      `${prefix}.topics`,
      `${prefix}.returnValues`,
      `${prefix}.transaction`,
      `${prefix}.created_at`,
    ]),
  ],
};

const INPUT_SCHEMA = z.object({
  txHash: z.string(),
});

async function findDestinationChainFromEvent(
  txHash: string,
  sourceChainId: string,
  logIndex: number,
  ctx: Context
): Promise<string | undefined> {
  const kvClient: MaestroKVClient = ctx.persistence.kv;

  const cacheKey = `event_dest_chain-${txHash}:${logIndex}-${sourceChainId}`;

  const cachedValue = await kvClient.getCached<string>(cacheKey);

  if (cachedValue) {
    return cachedValue;
  }

  if (sourceChainId.includes("sui")) {
    const eventData = await getSuiEventsByTxHash(suiClient, txHash);
    if (eventData) {
      for (const event of eventData.data.slice(0, logIndex).reverse()) {
        if (event.type.includes("InterchainTokenDeploymentStarted")) {
          const eventDetails = event.parsedJson as any;
          const destinationChainId: string = eventDetails.destination_chain;

          await kvClient.setCached(cacheKey, destinationChainId, 3600);

          return destinationChainId;
        }
      }
    }
  }

  // For EVM, seems like the final destination chain is provided in the searchGMP response, in interchain_token_deployment_started event.
  return undefined;
}

export async function getSecondHopStatus(
  messageId: string,
  ctx: Context
): Promise<GMPTxStatus> {
  const secondHopData = await ctx.services.gmp.searchGMP({
    messageId,
    _source: SEARCHGMP_SOURCE,
  });

  return secondHopData.length > 0 ? secondHopData[0].status : "pending";
}

export async function processGMPData(
  gmpData: any,
  ctx: Context
): Promise<[string, ChainStatus]> {
  const {
    call,
    callback,
    status: firstHopStatus,
    interchain_token_deployment_started,
  } = gmpData;

  let status = firstHopStatus;
  const logIndex = call.logIndex ?? call._logIndex ?? call.messageIdIndex ?? 0;
  let destinationChainFromSrcEvent: string | undefined;

  // Handle second hop for non-EVM chains
  if (call.chain_type !== "evm" && callback) {
    status = await getSecondHopStatus(callback.returnValues.messageId, ctx);
  }

  if (call.chain_type !== "evm") {
    destinationChainFromSrcEvent = await findDestinationChainFromEvent(
      call.receipt.transactionHash,
      call.returnValues.sourceChain,
      call._logIndex,
      ctx
    );
  }

  const destinationChain = (
    interchain_token_deployment_started?.destinationChain ??
    destinationChainFromSrcEvent ??
    callback?.returnValues.destinationChain ??
    call.returnValues.destinationChain
  ).toLowerCase();

  return [
    destinationChain,
    {
      status,
      txHash: call.transactionHash,
      logIndex,
      txId: gmpData.message_id,
      lastHop: call.chain_type === "evm" || !!callback,
    },
  ];
}

/**
 * Get the status of an GMP transaction on destination chains
 */
export const getTransactionStatusOnDestinationChains = publicProcedure
  .input(INPUT_SCHEMA)
  .query(async ({ input, ctx }) => {
    try {
      const data = await ctx.services.gmp.searchGMP({
        txHash: input.txHash,
        _source: SEARCHGMP_SOURCE,
      });

      if (!data.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      // Process all GMP data entries in parallel
      const processedEntries = await Promise.all(
        data.map((gmpData) => processGMPData(gmpData, ctx))
      );

      // Convert the processed entries into a ChainStatusMap
      const result = Object.fromEntries(processedEntries);

      return result;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get transaction status",
      });
    }
  });
