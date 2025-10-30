import type { Context } from "~/server/context";
import { getXRPLChainConfig, hex, parseTokenAmount, parseTokenGasValue } from "./utils";

import {
  type InterchainTransferInput,
} from "./types";

import * as xrpl from "xrpl";
import { autofillXRPLTx } from "~/lib/utils/xrpl";
import { TRPCError } from "@trpc/server";

export async function buildInterchainTransferTxBytes(
  ctx: Context,
  input: InterchainTransferInput
): Promise<{ txHex: string }> {
    if (BigInt(input.amount) <= 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Input must be positive",
      });
    }
    if (BigInt(input.gasValue) < 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Input must be non-negative",
      });
    }

    const xrplChainConfig = await getXRPLChainConfig(ctx);
    const amountToTransfer = BigInt(input.amount) + BigInt(input.gasValue);
    const gasFeeAmount = parseTokenGasValue(input.tokenAddress, input.gasValue);
    const amount = parseTokenAmount(input.tokenAddress, amountToTransfer.toString());

    const tx: xrpl.Payment = {
        TransactionType: "Payment",
        Account: input.caller,
        // @ts-expect-error - contracts is not a property of ChainConfig
        Destination: xrplChainConfig.config.contracts.InterchainTokenService.address,
        Amount: amount,
        Memos: [
            { Memo: { MemoType: hex("type"), MemoData: hex("interchain_transfer") } },
            { Memo: { MemoType: hex("destination_address"), MemoData: hex(input.destinationAddress.replace(/^0x/, "")) } },
            { Memo: { MemoType: hex("destination_chain"), MemoData: hex(input.destinationChain) } },
            { Memo: { MemoType: hex("gas_fee_amount"), MemoData: hex(gasFeeAmount) } },
        ]
    };

    // Fill in missing fields (Fee, Sequence, LastLedgerSequence, etc.)
    const prepared = await autofillXRPLTx(tx);

    const txHex = xrpl.encode(prepared);
    return { txHex };
}
