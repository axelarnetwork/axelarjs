import type { Context } from "~/server/context";
import { getXRPLChainConfig, hex, parseTokenAmount } from "./utils";

import {
  type InterchainTransferInput,
} from "./types";

import * as xrpl from "xrpl";

export async function buildInterchainTransferTxBytes(
  ctx: Context,
  input: InterchainTransferInput
): Promise<{ txBase64: string }> {
    console.log(ctx);

    const xrplChainConfig = await getXRPLChainConfig(ctx);

    const client = new xrpl.Client(xrplChainConfig.config.rpc[0]);
    await client.connect();

    const tx: xrpl.Payment = {
        TransactionType: "Payment",
        Account: input.caller,
        Destination: xrplChainConfig.config.contracts.InterchainTokenService as any, // TODO: fix
        Amount: parseTokenAmount(input.tokenAddress, input.amount),
        Memos: [
            { Memo: { MemoType: hex("type"), MemoData: hex("interchain_transfer") } },
            { Memo: { MemoType: hex("destination_address"), MemoData: hex(input.destinationAddress.replace(/^0x/, "")) } },
            { Memo: { MemoType: hex("destination_chain"), MemoData: hex(input.destinationChain) } },
            { Memo: { MemoType: hex("gas_fee_amount"), MemoData: hex(input.gasValue) } },
        ]
    };

    // Fill in missing fields (Fee, Sequence, LastLedgerSequence, etc.)
    const prepared = await client.autofill(tx);

    console.log("Prepared XRPL transaction:", prepared);

    const txBase64 = xrpl.encode(prepared);
    return { txBase64 };
}