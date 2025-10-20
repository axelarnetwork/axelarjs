import type { Context } from "~/server/context";
import { getXRPLChainConfig, hex, parseTokenAmount, parseTokenGasValue } from "./utils";
import { xrplChainConfig as xrplChainConfigDefault } from "~/config/chains";

import {
  type InterchainTransferInput,
} from "./types";

import * as xrpl from "xrpl";
import { invariant } from "@axelarjs/utils";

export async function buildInterchainTransferTxBytes(
  ctx: Context,
  input: InterchainTransferInput
): Promise<{ txBase64: string }> {
    invariant(parseInt(input.amount) > 0);
    invariant(parseInt(input.gasValue) >= 0);

    const xrplChainConfig = await getXRPLChainConfig(ctx);
    let amountToTransfer = BigInt(input.amount) + BigInt(input.gasValue);
    let gasFeeAmount = parseTokenGasValue(input.tokenAddress, input.gasValue);
    let amount = parseTokenAmount(input.tokenAddress, amountToTransfer.toString());

    const client = new xrpl.Client(xrplChainConfigDefault.rpcUrls.default.http[0]); // this must be a wss one! 
    try {
      await client.connect();

      const tx: xrpl.Payment = {
          TransactionType: "Payment",
          Account: input.caller,
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
      const prepared = await client.autofill(tx);

      const txBase64 = xrpl.encode(prepared);
      return { txBase64 };
    } 
    finally {
      try {
        await client.disconnect();
      } catch (_) {
        // ignore this
      }
    }
}