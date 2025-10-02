import type { Context } from "~/server/context";
import { VmChainConfig } from "~/config/chains/vm-chains";
import { xrplChainConfig } from "~/config/chains/vm-chains";

import {
  type InterchainTransferInput,
} from "./types";
import { invariant } from "@axelarjs/utils";

import * as xrpl from "xrpl";

function hex(str: string) {
    return Buffer.from(str).toString('hex');
}

export const getXRPLChainConfig = async (
  ctx: Context
): Promise<VmChainConfig> => {
  const chainConfigs = await ctx.configs.axelarConfigs();
  const chainConfig = chainConfigs.chains[xrplChainConfig.axelarChainId];

  return chainConfig;
};

// XRPL token is either:
// (1) "XRP"
// (2) "<currency>.<issuer-address>"
function parseTokenAmount(token: string, amount: string ) {
    let parsedAmount;

    if (token === 'XRP') {
        parsedAmount = xrpl.xrpToDrops(amount);
    } else {
        const [currency, issuer] = token.split('.');
        parsedAmount = {
            currency,
            issuer,
            value: amount,
        };
    }

    return parsedAmount;
}

export async function buildInterchainTransferTxBytes(
  ctx: Context,
  input: InterchainTransferInput
): Promise<{ txBase64: string }> {
    console.log(ctx);

    invariant(xrplChainConfig.contracts);

    const client = new xrpl.Client(xrplChainConfig.rpcUrls.default.http[0]);
    await client.connect();

    const tx: xrpl.Payment = {
        TransactionType: "Payment",
        Account: input.caller,
        Destination: xrplChainConfig.contracts.interchainAccount, // TODO: fix
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